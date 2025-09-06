import { StyleSheet,  View } from 'react-native'
import React, { useState } from 'react'
import { Page } from '@/components/page'
import { Text } from '@/components/ui/text'
import { router } from 'expo-router'
import { Button } from '@/components/ui/button'
import { useUserStore } from '@/stores/userStore'
import { Input } from '@/components/ui/input'

const ProfileSetupTwoScreen = () => {
  const [majors, setMajors] = useState('')
  const [minors, setMinors] = useState('')
  const [bio, setBio] = useState('')
  const {setUserProfile} = useUserStore()

  const handleNext = async () => {
    const profile = {
      majors: majors.split(','),
      minors: minors.split(','),
      bio,
    }
    setUserProfile(profile)
    router.navigate('/(onboarding)/enableNotifications')
  }
  return (
    <Page>
      <Text>Profile Setup Two</Text>
      <Input placeholder='Majors' value={majors} onChangeText={setMajors} />
      <Input placeholder='Minors' value={minors} onChangeText={setMinors} />
      <Input placeholder='Bio' value={bio} onChangeText={setBio} />
      <Button disabled={!majors || !bio} onPress={handleNext}>
        <Text>Next</Text>
      </Button>
    </Page>
  )
}

export default ProfileSetupTwoScreen