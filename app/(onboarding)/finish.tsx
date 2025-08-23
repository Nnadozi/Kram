import OnboardScreen from '@/components/OnboardScreen'
import { useUserStore } from '@/stores/userStore'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import { Timestamp } from 'firebase/firestore'
import React, { useEffect } from 'react'
import { StyleSheet } from 'react-native'

const finish = () => {
  const { userProfile, setUserProfile } = useUserStore()
  
  useEffect(() => {
    const markOnboardingComplete = async () => {
      try {
        // Store onboarding status in AsyncStorage
        await AsyncStorage.setItem('isOnboarded', 'true')
        
        // Update user profile in Firestore if available
        if (userProfile) {
          await setUserProfile({ ...userProfile, updatedAt: new Timestamp(new Date().getTime(), 0) })
        }
      } catch (error) {
        console.error('Error marking onboarding complete:', error)
      }
    }
    
    markOnboardingComplete()
  }, [userProfile, setUserProfile])
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