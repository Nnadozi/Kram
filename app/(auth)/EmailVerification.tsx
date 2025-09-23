import CustomButton from '@/components/CustomButton'
import CustomText from '@/components/CustomText'
import Page from '@/components/Page'
import { useAsyncOperation } from '@/hooks/useAsyncOperation'
import { useEmailVerificationDeadline } from '@/hooks/useEmailVerificationDeadline'
import { authService } from '@/services/authService'
import { useUserStore } from '@/stores/userStore'
import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import { IconButton, useTheme } from 'react-native-paper'

const EmailVerification = () => {
  const [isChecking, setIsChecking] = useState(false)
  const colors = useTheme().colors
  const { authUser, isEmailVerified, setAuthUser, clearEmailVerificationDeadline } = useUserStore()
  const { shouldShowEmailVerification, timeRemaining } = useEmailVerificationDeadline()

  const { execute: resendVerification, isLoading } = useAsyncOperation({
    onSuccess: () => {
      Alert.alert(
        'Verification Email Sent',
        'Please check your email and click the verification link to continue.'
      )
    },
    onError: (error) => {
      Alert.alert('Error', error.message)
    }
  })

  // Format time remaining
  const formatTimeRemaining = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  // Check verification status periodically
  useEffect(() => {
    const checkVerification = async () => {
      if (!authUser) return
      
      setIsChecking(true)
      try {
        // Reload user to get latest verification status
        await authUser.reload()
        setAuthUser(authUser)
        
        // If verified, proceed to onboarding
        if (authUser.emailVerified) {
          // Clear the verification deadline since email is now verified
          clearEmailVerificationDeadline()
          setTimeout(() => {
            router.replace('/(onboarding)/ProfileSetupOne')
          }, 100)
        }
      } catch (error) {
        console.error('Error checking verification status:', error)
      } finally {
        setIsChecking(false)
      }
    }

    // Check immediately
    checkVerification()

    // Check every 5 seconds
    const interval = setInterval(checkVerification, 5000)

    return () => clearInterval(interval)
  }, [authUser])

  // Redirect if verification is not needed
  useEffect(() => {
    if (!shouldShowEmailVerification) {
      setTimeout(() => {
        router.replace('/(auth)')
      }, 100)
    }
  }, [shouldShowEmailVerification])

  const handleResendVerification = () => {
    resendVerification(async () => {
      await authService.sendEmailVerification()
    })
  }

  const handleSignOut = async () => {
    try {
      await authService.signOut()
      setTimeout(() => {
        router.replace('/(auth)')
      }, 100)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <Page>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <IconButton
            icon="email-outline"
            size={80}
            iconColor={colors.primary}
            style={styles.emailIcon}
          />
        </View>

        <View style={styles.content}>
          <CustomText bold fontSize="2xl" style={styles.title}>
            Verify Your Email
          </CustomText>
          
          <CustomText fontSize="base" style={styles.message}>
            We've sent a verification link to:
          </CustomText>
          
          <CustomText bold fontSize="base" style={styles.email}>
            {authUser?.email}
          </CustomText>
          
          <CustomText fontSize="sm" style={styles.instructions}>
            Please check your email and click the verification link to continue with your account setup.
          </CustomText>
          
          {timeRemaining > 0 && (
            <View style={styles.timerContainer}>
              <CustomText fontSize="sm" style={styles.timerLabel}>
                Time remaining:
              </CustomText>
              <CustomText bold fontSize="base" style={styles.timer}>
                {formatTimeRemaining(timeRemaining)}
              </CustomText>
            </View>
          )}
        </View>

        <View style={styles.actions}>
          <CustomButton 
            onPress={handleResendVerification}
            loading={isLoading}
            loadingText="Sending..."
            style={styles.resendButton}
          >
            Resend Verification Email
          </CustomButton>
          
          <CustomButton 
            variant="outlined"
            onPress={handleSignOut}
            style={styles.signOutButton}
          >
            Sign Out
          </CustomButton>
        </View>

        {isChecking && (
          <CustomText fontSize="xs" style={styles.checkingText}>
            Checking verification status...
          </CustomText>
        )}
      </View>
    </Page>
  )
}

export default EmailVerification

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  iconContainer: {
    marginBottom: 32,
  },
  emailIcon: {
    backgroundColor: '#f5f5f5',
    borderRadius: 50,
  },
  content: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    marginBottom: 8,
    textAlign: 'center',
    color: '#666',
  },
  email: {
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  instructions: {
    textAlign: 'center',
    color: '#666',
    lineHeight: 20,
  },
  timerContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  timerLabel: {
    textAlign: 'center',
    color: '#856404',
    marginBottom: 4,
  },
  timer: {
    textAlign: 'center',
    color: '#856404',
  },
  actions: {
    width: '100%',
    gap: 12,
  },
  resendButton: {
    width: '100%',
  },
  signOutButton: {
    width: '100%',
  },
  checkingText: {
    marginTop: 16,
    color: '#666',
    fontStyle: 'italic',
  },
})
