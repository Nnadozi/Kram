import OnboardScreen from '@/components/OnboardScreen'
import { router } from 'expo-router'
import React from 'react'
import { StyleSheet } from 'react-native'

const finish = () => {
  return (
    <OnboardScreen
      title="All Done!"
      description="Your all done! Enjoy your ConnectEd journey."
      buttonText='Lets Go!'
      onButtonPress={() => {router.replace('/(main)')}}
      progress={1}
    ></OnboardScreen>
  )
}

export default finish

const styles = StyleSheet.create({})