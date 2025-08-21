import OnboardScreen from '@/components/OnboardScreen'
import { router } from 'expo-router'
import React from 'react'
import { StyleSheet } from 'react-native'

const InfoCarousel = () => {
  return (
    <OnboardScreen
      title="Here's How it Works"
      description="Nevr study alone again."
      onButtonPress={() => {router.navigate('/(onboarding)/findSchool')}}
      progress={0.2}
    >
      
    </OnboardScreen>
  )
}

export default InfoCarousel

const styles = StyleSheet.create({})