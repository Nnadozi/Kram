import OnboardScreen from '@/components/OnboardScreen'
import { useUserStore } from '@/stores/userStore'
import { router } from 'expo-router'
import { Timestamp } from 'firebase/firestore'
import React from 'react'
import { StyleSheet } from 'react-native'

const profileSetupOne = () => {
  const { userObject, setUserProfile } = useUserStore()
  const handleContinue = () => {
    setUserProfile({
      uid: userObject?.uid || '',
      email: userObject?.email || '',
      school: 'test school',
      state: 'test state',
      firstName: 'test first name',
      lastName: 'test last name',
      profilePicture: 'test profile picture',
      bio: 'test bio',
      year: 'test year',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
    router.navigate('/(onboarding)/profileSetupTwo')
  }
  return (
    <OnboardScreen
      title="Profile Setup"
      description="Let's setup your profile ONE"
      buttonText='Continue'
      onButtonPress={handleContinue}
      progress={0.6}
    ></OnboardScreen>
  )
}

export default profileSetupOne

const styles = StyleSheet.create({})