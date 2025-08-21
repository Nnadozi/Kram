import MyInput from '@/components/MyInput'
import OnboardScreen from '@/components/OnboardScreen'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { StyleSheet } from 'react-native'

const findSchool = () => {
  const [school, setSchool] = useState('')
  const [email, setEmail] = useState('')
  return (
    <OnboardScreen
      title="Find Your School"
      description="Let's find your school"
      buttonText='Verify Email Address'
      onButtonPress={() => {router.navigate('/(onboarding)/verifySchool')}}
      progress={0.3}
    >
      <MyInput
        placeholder='Select School'
        value={school}
        onChangeText={setSchool}
      />
    </OnboardScreen>
  )
}

export default findSchool

const styles = StyleSheet.create({})