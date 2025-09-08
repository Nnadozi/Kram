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
    router.replace('/(onboarding)/EnableNotifications')
  }
  return (
    <Page>
      <Text>Profile Setup Two</Text>
      <Input 
        placeholder='Majors' 
        value={majors} 
        onChangeText={setMajors} 
        maxLength={200}
        className='mb-4'
      />
      <Input 
        placeholder='Minors' 
        value={minors} 
        onChangeText={setMinors} 
        maxLength={200}
        className='mb-4'
      />
      <Input 
        placeholder='Bio' 
        value={bio} 
        onChangeText={setBio} 
        maxLength={500}
        multiline
        numberOfLines={3}
        inputHeight={80}
        className='mb-4'
      />
      <Button disabled={!majors || !bio} onPress={handleNext}>
        <Text>Next</Text>
      </Button>
    </Page>
  )
}

export default ProfileSetupTwoScreen