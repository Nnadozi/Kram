import MyButton from '@/components/MyButton'
import MyInput from '@/components/MyInput'
import MyText from '@/components/MyText'
import OnboardScreen from '@/components/OnboardScreen'
import { auth } from '@/firebase/firebaseConfig'
import { useUserStore } from '@/stores/userStore'
import { router, useLocalSearchParams } from 'expo-router'
import { createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification } from 'firebase/auth'
import { Timestamp } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import { useTheme } from 'react-native-paper'

const verifySchool = () => {
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const { userObject, setUserProfile, userProfile, setUserObject, setIsAuthenticated } = useUserStore()
  const { school, email } = useLocalSearchParams()
  const theme = useTheme()
  
  // Check if user's email is verified
  useEffect(() => {
    if (userObject) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user && user.emailVerified) {
          setIsEmailVerified(true)
        }
      })
      return unsubscribe
    }
  }, [userObject])

  async function createFirebaseAccount() {
    if (!password || password.length < 10 || password !== confirmPassword) {
      Alert.alert('Error', 'Password must be at least 10 characters and match')
      return
    }

    setLoading(true)
    try {
      // Create Firebase Auth account
      const userCredential = await createUserWithEmailAndPassword(auth, email as string, password)
      const user = userCredential.user
      
      // Send email verification
      if(user !== null) {
        await sendEmailVerification(user, {
          url: 'https://connected-e23fd.firebaseapp.com/',
          handleCodeInApp: true, 
          android: {
            packageName: 'com.connected.app',
            installApp: true,
          },
          iOS: {
            bundleId: 'com.connected.app',
          },
        })
      }
      // Update user store
      setUserObject(user)
      setIsAuthenticated(true)
      
      // Set initial profile
      await setUserProfile({
        uid: user.uid,
        email: email as string,
        school: school as string,
        firstName: '',
        lastName: '',
        profilePicture: '',
        bio: '',
        graduationYear: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        isOnboarded: false,
      })
      
      Alert.alert(
        'Account Created!', 
        'Please check your email and click the verification link, then return here to continue.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Wait for email verification
              const checkVerification = setInterval(async () => {
                try {
                  await user.reload()
                  if (user.emailVerified) {
                    clearInterval(checkVerification)
                    setIsEmailVerified(true)
                    Alert.alert('Success', 'Email verified! You can now continue.')
                    
                  }
                } catch (error) {
                  console.error('Error checking verification:', error)
                }
              }, 2000) // Check every 2 seconds
            }
          }
        ]
      )
      
    } catch (error: any) {
      let errorMessage = 'Failed to create account'
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email already registered. Please sign in instead.'
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak'
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email format'
      }
      
      Alert.alert('Error', errorMessage)
      console.error('Error creating account:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleResendVerificationEmail() {
    if (!userObject) {
      Alert.alert('Error', 'No user found. Please create an account first.')
      return
    }

    setResendLoading(true)
    try {
      await sendEmailVerification(userObject, {
        url: 'https://connected-e23fd.firebaseapp.com/',
        handleCodeInApp: true, 
        android: {
          packageName: 'com.connected.app',
          installApp: true,
        },
        iOS: {
          bundleId: 'com.connected.app',
        },
      })
      
      Alert.alert(
        'Verification Email Sent', 
        'Please check your email and spam folder for the verification link.'
      )
      
    } catch (error: any) {
      let errorMessage = 'Failed to resend verification email'
      
      if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please wait a moment before trying again.'
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'User not found. Please create an account first.'
      }
      
      Alert.alert('Error', errorMessage)
      console.error('Error resending verification email:', error)
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <OnboardScreen
      title="Account Setup"
      description="Verify your school email and create an account"
      buttonText='Continue'
      buttonEnabled={isEmailVerified}
      onButtonPress={() => router.navigate('/(onboarding)/profileSetup')}
      progress={0.4}
      style={{gap: 10}}
    >
      <View style={[styles.infoContainer, {borderColor:theme.colors.primary, backgroundColor:theme.colors.background}]}>
        <MyText primary bold>{school}</MyText>
        <MyText primary bold>{email}</MyText>
      </View>

      {!userObject ? (
        <View>
          <MyInput
            placeholder="Password (min 10 characters)"
            label="Create Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            maxLength={50}
          />
          <MyInput
            placeholder="Confirm Password"
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={true}
          />
          <MyButton 
            title="Create Account & Send Verification Email" 
            onPress={createFirebaseAccount} 
            isLoading={loading}
            disabled={loading || password.length < 10}
            style={{marginTop: 10}}
            mode='outlined'
          />
        </View>
      ) : !isEmailVerified ? (
        <View style={styles.verificationContainer}>
          <MyText>✅ Account created successfully!</MyText>
          <MyText>📧 Verification email sent to: {email}</MyText>
          <MyText>Please check your email spam folder and click the verification link.</MyText>
          <MyText>This page will automatically detect when you're verified.</MyText>
          <MyButton 
            title='Resend Verification Email' 
            onPress={handleResendVerificationEmail}
            isLoading={resendLoading}
            disabled={resendLoading}
            mode='outlined'
            style={{marginTop: 10}}
          />
        </View>
      ) : (
        <View style={styles.verifiedContainer}>
          <MyText bold style={{color: 'green'}}>✅ Email verified successfully!</MyText>
          <MyText>You can now continue to the next step.</MyText>
        </View>
      )}
    </OnboardScreen>
  )
}

export default verifySchool

const styles = StyleSheet.create({
  infoContainer: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  verificationContainer: {
    gap: 10,
    backgroundColor: '#e8f5e8',
    padding: 15,
    borderRadius: 8,
  },
  verifiedContainer: {
    gap: 10,
    backgroundColor: '#e8f5e8',
    padding: 15,
    borderRadius: 8,
  },
})