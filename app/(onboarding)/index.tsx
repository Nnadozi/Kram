import MyButton from '@/components/MyButton'
import MyText from '@/components/MyText'
import Page from '@/components/Page'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Redirect, router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'

const Index = () => {
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const status = await AsyncStorage.getItem('isOnboarded')
        setIsOnboarded(status === 'true')
      } catch (error) {
        console.error('Error checking onboarding status:', error)
        setIsOnboarded(false)
      } finally {
        setLoading(false)
      }
    }
    
    checkOnboardingStatus()
  }, [])

  // Show loading while checking status
  if (loading) {
    return <Page><MyText>Loading...</MyText></Page>
  }

  // Redirect if already onboarded
  if (isOnboarded) {
    return <Redirect href="/(main)" />
  }

  function handleReturningUser() {
    console.log('Sign in')
    router.navigate('/(auth)/signin')
  }

  function handleNewUser() {
    console.log('Sign up')
    router.navigate('/(onboarding)/welcome')
  }

  return (
    <Page>
      <MyButton title="Returning User? Log in" onPress={handleReturningUser} />
      <MyButton mode='outlined' title="New User? Get Started" onPress={handleNewUser} />
      <MyButton mode='outlined' title="Skiip to verify school" onPress={() => router.navigate('/(onboarding)/verifySchool')} />
      <MyButton mode='outlined' title="Skiip to profile setup" onPress={() => router.navigate('/(onboarding)/profileSetup')} />
    </Page>
  )
}

export default Index

const styles = StyleSheet.create({})