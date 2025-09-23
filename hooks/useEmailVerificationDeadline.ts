import { authService } from '@/services/authService'
import { userService } from '@/services/userService'
import { useUserStore } from '@/stores/userStore'
import { router } from 'expo-router'
import { useEffect } from 'react'
import { Alert } from 'react-native'

/**
 * Hook to handle email verification deadline and auto-deletion
 * This runs on app start and checks if the 24-hour deadline has passed
 */
export const useEmailVerificationDeadline = () => {
  const { 
    authUser, 
    emailVerificationDeadline, 
    isEmailVerified, 
    shouldShowEmailVerification,
    setEmailVerificationDeadline 
  } = useUserStore()

  useEffect(() => {
    const checkDeadline = async () => {
      if (!authUser || isEmailVerified()) {
        return
      }

      const now = Date.now()
      
      // If deadline has passed, delete the account
      if (emailVerificationDeadline && now > emailVerificationDeadline) {
        try {
          // Delete user document from Firestore first
          await userService.deleteUserDocument(authUser.uid)
          console.log('User document deleted due to verification deadline')
          
          // Delete Firebase Auth account
          await authService.deleteAccount()
          console.log('Firebase Auth account deleted due to verification deadline')
          
          // Show alert and redirect to onboarding
          Alert.alert(
            'Account Deleted',
            'Your account has been automatically deleted because you did not verify your email within 24 hours.',
            [
              {
                text: 'OK',
                onPress: () => {
                  // Delay navigation to ensure it's safe
                  setTimeout(() => {
                    router.replace('/(onboarding)')
                  }, 100)
                }
              }
            ]
          )
        } catch (error) {
          console.error('Error deleting account after deadline:', error)
          // Still redirect to onboarding even if deletion fails
          setTimeout(() => {
            router.replace('/(onboarding)')
          }, 100)
        }
      }
    }

    checkDeadline()
  }, [authUser, emailVerificationDeadline, isEmailVerified])

  return {
    shouldShowEmailVerification: shouldShowEmailVerification(),
    timeRemaining: emailVerificationDeadline ? Math.max(0, emailVerificationDeadline - Date.now()) : 0
  }
}
