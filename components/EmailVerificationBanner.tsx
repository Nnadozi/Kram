import { useAsyncOperation } from '@/hooks/useAsyncOperation'
import { authService } from '@/services/authService'
import { useUserStore } from '@/stores/userStore'
import { Alert, StyleSheet, View } from 'react-native'
import { IconButton } from 'react-native-paper'
import CustomButton from './CustomButton'
import CustomText from './CustomText'

interface EmailVerificationBannerProps {
  onDismiss?: () => void
}

const EmailVerificationBanner = ({ onDismiss }: EmailVerificationBannerProps) => {
  const { isEmailVerified } = useUserStore()

  const { execute: resendVerification, isLoading } = useAsyncOperation({
    onSuccess: () => {
      Alert.alert(
        'Verification Email Sent',
        'Please check your email and click the verification link.'
      )
    },
    onError: (error) => {
      Alert.alert('Error', error.message)
    }
  })

  const handleResendVerification = () => {
    resendVerification(async () => {
      await authService.sendEmailVerification()
    })
  }

  // Don't show banner if email is already verified
  if (isEmailVerified()) {
    return null
  }

  return (
    <View style={styles.banner}>
      <View style={styles.content}>
        <IconButton 
          icon="email-outline" 
          size={20} 
          iconColor="#ff6b35"
        />
        <View style={styles.textContainer}>
          <CustomText bold fontSize="sm" style={styles.title}>
            Verify Your Email
          </CustomText>
          <CustomText fontSize="xs" style={styles.message}>
            Please check your email and click the verification link to complete your account setup.
          </CustomText>
        </View>
      </View>
      
      <View style={styles.actions}>
        <CustomButton 
          variant="outlined"
          onPress={handleResendVerification}
          loading={isLoading}
          loadingText="Sending..."
          style={styles.resendButton}
        >
          Resend
        </CustomButton>
        
        {onDismiss && (
          <IconButton 
            icon="close" 
            size={16} 
            onPress={onDismiss}
            iconColor="#666"
          />
        )}
      </View>
    </View>
  )
}

export default EmailVerificationBanner

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#fff3e0',
    borderLeftWidth: 4,
    borderLeftColor: '#ff6b35',
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  textContainer: {
    flex: 1,
    marginLeft: 8,
  },
  title: {
    color: '#e65100',
    marginBottom: 2,
  },
  message: {
    color: '#bf360c',
    lineHeight: 16,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resendButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    minWidth: 80,
  },
})
