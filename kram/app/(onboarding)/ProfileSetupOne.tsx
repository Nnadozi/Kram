import { StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { Page } from '@/components/page'
import { Text } from '@/components/ui/text'
import { Button } from '@/components/ui/button'
import { router } from 'expo-router'
import { Input } from '@/components/ui/input'
import { useUserStore } from '@/stores/userStore'

const ProfileSetupOneScreen = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [school, setSchool] = useState('')
  const [graduationYear, setGraduationYear] = useState('')
  const {setUserProfile} = useUserStore()

  const handleNext = async () => {
    const profile = {
      firstName,
      lastName,
      school,
      graduationYear: parseInt(graduationYear),
    }
    setUserProfile(profile)
    router.replace('/(onboarding)/ProfileSetupTwo')
  }
  return (
    <Page>
      <Text>Profile Setup One</Text>
      <Input placeholder='First Name' value={firstName} onChangeText={setFirstName} />
      <Input placeholder='Last Name' value={lastName} onChangeText={setLastName} />
      <Input placeholder='School' value={school} onChangeText={setSchool} />
      <Input placeholder='Graduation Year' value={graduationYear} onChangeText={setGraduationYear} />
      <Button disabled={!firstName || !lastName || !school || !graduationYear} onPress={handleNext}>
        <Text>Next</Text>
      </Button>
    </Page>
  )
}

export default ProfileSetupOneScreen

const styles = StyleSheet.create({})