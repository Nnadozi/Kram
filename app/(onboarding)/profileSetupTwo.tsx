import OnboardScreen from '@/components/OnboardScreen'
import { router } from 'expo-router'
import React from 'react'
import { StyleSheet } from 'react-native'

const profileSetupTwo = () => {
  return (
    <OnboardScreen
      title="Profile Setup"
      description="Let's setup your profile TWO"
      buttonText='Continue'
      onButtonPress={() => {router.navigate('/(onboarding)/finish')}}
      progress={0.75}
    ></OnboardScreen>
  )
}

export default profileSetupTwo

const styles = StyleSheet.create({})