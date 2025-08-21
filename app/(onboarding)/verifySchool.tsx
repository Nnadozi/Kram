import MyText from '@/components/MyText'
import OnboardScreen from '@/components/OnboardScreen'
import { useUserStore } from '@/stores/userStore'
import { router, useLocalSearchParams } from 'expo-router'
import React from 'react'
import { StyleSheet } from 'react-native'

const verifySchool = () => {
  const { userObject, setUserObject } = useUserStore()
  const { school, state, email } = useLocalSearchParams()
  return (
    <OnboardScreen
      title="Verify Your School"
      description="Let's verify your school"
      buttonText='Continue'
      onButtonPress={() => {router.navigate('/(onboarding)/profileSetupOne')}}
      progress={0.4}
    >
      <MyText>1. Select School</MyText>
      <MyText>2. Enter school email</MyText>
      <MyText>3. Send OTP to school email</MyText>
      <MyText>4. Enter OTP to verify</MyText>
      <MyText>School: {school}</MyText>
      <MyText>State: {state}</MyText>
      <MyText>Email: {email}</MyText>
    </OnboardScreen>
  )
}

export default verifySchool

const styles = StyleSheet.create({})