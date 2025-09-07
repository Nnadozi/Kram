import { StyleSheet, View } from 'react-native'
import { Page } from '@/components/page'
import { Text } from '@/components/ui/text'
import React from 'react'
import { Button } from '@/components/ui/button'
import { router } from 'expo-router'
import { useUserStore } from '@/stores/userStore'

const FinishScreen = () => {
  const {setUserProfile} = useUserStore()
  const handleNext = async () => {
    const profile = {
      onboardingComplete: true,
    }
    setUserProfile(profile)
    router.replace('/(main)/(tabs)/Groups')
  }
  return (
    <Page>
      <Text>Finish</Text>
      <Button onPress={handleNext}>
        <Text>Start using Kram</Text>
      </Button>
    </Page>
  )
}

export default FinishScreen

const styles = StyleSheet.create({})