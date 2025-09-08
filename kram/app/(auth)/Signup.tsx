import { Alert, StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { Page } from '@/components/page'
import { Text } from '@/components/ui/text'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/firebase/firebaseConfig'
import { useUserStore } from '@/stores/userStore'
import { router } from 'expo-router'
import { db } from '@/firebase/firebaseConfig'
import { setDoc, doc, serverTimestamp } from 'firebase/firestore'

const SignupScreen = () => {
  const [usingEmail, setUsingEmail] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const {setAuthUser} = useUserStore()

  async function signUp() {
    await createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
      setAuthUser(userCredential.user)
      setDoc(doc(db, 'users', userCredential.user.uid), {
        id: userCredential.user.uid,
        email: userCredential.user.email,
        onboardingComplete: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      router.replace('/(onboarding)/ProfileSetupOne')
    }).catch((error) => {
      Alert.alert(error.code, error.message)
    })
  }

  return (
    <Page>
      <Text>Signup</Text>
      <Button>
        <Text>Signup with Google</Text>
      </Button>
      <Button>
        <Text>Signup with Apple</Text>
      </Button>
      <Button onPress={() => setUsingEmail(true)}>
        <Text>Signup with Email</Text>
      </Button>
      {usingEmail && (
        <View style = {{marginVertical: 50}}>
          <Input 
            autoCapitalize='none' 
            value={email} 
            onChangeText={setEmail} 
            maxLength={100}
            placeholder='Email'
            className='mb-4'
          />
          <Input 
            autoCapitalize='none' 
            value={password} 
            onChangeText={setPassword} 
            maxLength={50}
            placeholder='Password'
            secureTextEntry
            className='mb-4'
          />
          <Button onPress={signUp}>
            <Text>Signup</Text>
          </Button>
        </View>
      )}
    </Page>
  )
}

export default SignupScreen

const styles = StyleSheet.create({})