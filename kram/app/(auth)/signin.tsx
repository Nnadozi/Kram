import { Alert, StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { auth, db } from '@/firebase/firebaseConfig'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { useUserStore } from '@/stores/userStore'
import { router } from 'expo-router'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Page } from '@/components/page'
import { Text } from '@/components/ui/text'

const SigninScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const {setAuthUser, setUserProfile} = useUserStore()
  
  async function signIn() {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      setAuthUser(userCredential.user)
      
      // Fetch user profile from Firestore
      const userDocRef = doc(db, 'users', userCredential.user.uid)
      const userDoc = await getDoc(userDocRef)
      
      if (userDoc.exists()) {
        const profileData = userDoc.data()
        setUserProfile(profileData)
        
        // Navigate based on onboarding status
        if (!profileData?.onboardingComplete) {
          router.navigate('/(onboarding)/profileSetupOne')
        } else {
          router.navigate('/(main)/groups')
        }
      } else {
        // No profile exists, start onboarding
        router.navigate('/(onboarding)/profileSetupOne')
      }
    } catch (error) {
      Alert.alert('Error', (error as Error).message)
    }
  }
  return (
    <Page>
      <Text>Sign in</Text>
      <Input placeholder='Email' value={email} onChangeText={setEmail} />
      <Input placeholder='Password' value={password} onChangeText={setPassword} />
      <Button onPress={signIn}>
        <Text>Sign in</Text>
      </Button>
      <Button style={{ marginTop: 50 }} onPress={() => router.navigate('/(auth)/signup')}>
        <Text>New user? Sign up</Text>
      </Button>
      <Button style={{ marginTop: 50 }} onPress={() => router.navigate('/(main)/groups')}>
        <Text>DEV SKIPPPP</Text>
      </Button>
    </Page>
  )
}

export default SigninScreen

const styles = StyleSheet.create({})