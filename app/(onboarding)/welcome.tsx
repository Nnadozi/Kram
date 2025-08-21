import OnboardScreen from '@/components/OnboardScreen'
import { router } from 'expo-router'
import React from 'react'
import { StyleSheet } from 'react-native'

const welcome = () => {
  return (
    <OnboardScreen
      title="Welcome!"
      description="Let's get you set up for ConnectEd"
      buttonText='Get Started'
      onButtonPress={() => {router.navigate('/infoCarousel')}}
      progress={0.1}
    >
      
    </OnboardScreen>
  )
}

export default welcome

const styles = StyleSheet.create({})