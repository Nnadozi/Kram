import MyButton from '@/components/MyButton'
import Page from '@/components/Page'
import { router } from 'expo-router'
import React from 'react'
import { StyleSheet } from 'react-native'

function handleReturningUser() {
  console.log('Sign in')
  router.navigate('/(auth)/signin')
}

function handleNewUser() {
  console.log('Sign up')
  router.navigate('/(onboarding)/welcome')
}

const index = () => {
  return (
    <Page>
      <MyButton title="Returning User? Log in" onPress={handleReturningUser} />
      <MyButton mode='outlined' title="New User? Get Started" onPress={handleNewUser} />
    </Page>
  )
}

export default index

const styles = StyleSheet.create({})