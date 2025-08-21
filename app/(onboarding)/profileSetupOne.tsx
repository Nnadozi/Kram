import OnboardScreen from '@/components/OnboardScreen'
import { router } from 'expo-router'
import React from 'react'
import { StyleSheet } from 'react-native'

const profileSetupOne = () => {
  return (
    <OnboardScreen
      title="Profile Setup"
      description="Let's setup your profile ONE"
      buttonText='Continue'
      onButtonPress={() => {router.navigate('/(onboarding)/profileSetupTwo')}}
      progress={0.6}
    ></OnboardScreen>
  )
}

export default profileSetupOne

const styles = StyleSheet.create({})