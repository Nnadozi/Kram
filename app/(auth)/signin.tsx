import MyButton from '@/components/MyButton'
import MyInput from '@/components/MyInput'
import Page from '@/components/Page'
import { auth } from '@/firebase/firebaseConfig'
import { useUserStore } from '@/stores/userStore'
import { router } from 'expo-router'
import { signInWithEmailAndPassword } from 'firebase/auth'
import React, { useState } from 'react'
import { Alert, StyleSheet } from 'react-native'

const signin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { setUserObject, setIsAuthenticated, userProfile, loading, setLoading, fetchUserProfile } = useUserStore()
  async function handleSignIn() {
    try {
      setLoading(true)
      await signInWithEmailAndPassword(auth, email, password).then(async (userCredential) => {
        const user = userCredential.user
        if(user) {
          setUserObject(user)
          setIsAuthenticated(true)
          
          // Fetch user profile from Firestore
          try {
            await fetchUserProfile(user.uid)
            // Get the updated profile from the store after fetching
            const { getState } = useUserStore
            const currentProfile = getState().userProfile
            Alert.alert('Signed In!', `Welcome back ${currentProfile?.firstName || 'User'}!`)
          } catch (profileError) {
            console.error('Error fetching user profile:', profileError)
            Alert.alert('Signed In!', 'Welcome back!')
          }
          
          router.navigate('/(main)')
        }
      })
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      switch(errorCode) {
        case 'auth/invalid-email':
          Alert.alert('Invalid Email', 'Please enter a valid email address')
          break
        case 'auth/user-not-found':
          Alert.alert('User Not Found', 'No account found with this email. Please check your email or create a new account')
          break
        case 'auth/wrong-password':
          Alert.alert('Wrong Password', 'Incorrect password. Please try again')
          break
        case 'auth/invalid-credential':
          Alert.alert('Invalid Credentials', 'Email or password is incorrect. Please try again')
          break
        case 'auth/user-disabled':
          Alert.alert('Account Disabled', 'This account has been disabled. Please contact support')
          break
        case 'auth/too-many-requests':
          Alert.alert('Too Many Attempts', 'Too many failed sign-in attempts. Please try again later')
          break
        case 'auth/network-request-failed':
          Alert.alert('Network Error', 'Please check your internet connection and try again')
          break
        case 'auth/operation-not-allowed':
          Alert.alert('Sign-in Disabled', 'Email/password sign-in is not enabled for this app')
          break
        case 'auth/requires-recent-login':
          Alert.alert('Re-authentication Required', 'Please sign in again to continue')
          break
        default:
          Alert.alert('Sign-in Error', 'An unexpected error occurred. Please try again later. Contact support if the problem persists.')
          console.error('Firebase auth error:', errorCode, errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }
  return (
    <Page>
      <MyInput
        placeholder='Enter Email'
        value={email}
        onChangeText={setEmail}
      />
      <MyInput
        placeholder='Enter Password'
        value={password}
        onChangeText={setPassword}
      />
      <MyButton disabled={email === '' || password === ''} isLoading={loading} title='Sign In' onPress={handleSignIn} />
    </Page>
  )
}

export default signin

const styles = StyleSheet.create({})