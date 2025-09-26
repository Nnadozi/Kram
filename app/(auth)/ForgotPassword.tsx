import CustomButton from '@/components/CustomButton'
import CustomInput from '@/components/CustomInput'
import CustomText from '@/components/CustomText'
import Page from '@/components/Page'
import { auth } from '@/firebaseConfig'
import { useAsyncOperation } from '@/hooks/useAsyncOperation'
import { createValidationConfig, useFormValidation } from '@/hooks/useFormValidation'
import { validationRules } from '@/util/validation'
import { router } from 'expo-router'
import { sendPasswordResetEmail } from 'firebase/auth'
import { useState } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import { IconButton } from 'react-native-paper'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const isEmailValid = validationRules.email(email)
  const validationConfig = createValidationConfig.custom({
    email: {
      rule: validationRules.email,
      errorMessage: 'Invalid email'
    }
  })
  const { execute: resetPassword, isLoading, error } = useAsyncOperation({
    errorMessage: 'Failed to reset password. Please try again.',
    showErrorAlert: true,
    onSuccess: () => {
      Alert.alert(
        'Password Reset', 
        'An email has been sent to reset your password',
        [{ text: 'OK', onPress: () => router.back() }]
      )
    },
    onError: (error) => {
      console.log(error)
    }
  })
  const { showValidationAlert } = useFormValidation(validationConfig)

  async function handleResetPassword() {
    if (!isEmailValid) {
      showValidationAlert('email')
      return
    }
    resetPassword(async () => {
      await sendPasswordResetEmail(auth, email)
    })
  }
  return (
    <Page>
      <IconButton
        icon="arrow-left"
        onPress={() => router.back()}
        style={{alignSelf: 'flex-start',right:20}}     
      />
      <View style={{width: '100%', marginBottom:5}}>
      <CustomText style={{width: '100%'}} textAlign='left' bold fontSize='2xl'>Reset Password</CustomText>
      <CustomText style={{width: '100%'}} textAlign='left' fontSize='sm'>Enter the email associated with your account</CustomText>
      </View>
      <View style={{width: '100%', marginBottom:15}}>
        <CustomInput autoCapitalize='none' label='Email' value={email} onChangeText={setEmail} mode='outlined' placeholder='Enter Email' />
      </View>
      <CustomButton 
        onPress={handleResetPassword} 
        disabled={!isEmailValid}
        loading={isLoading}
        loadingText="Sending Reset Email..."
      >
        Reset Password
      </CustomButton>
    </Page>
  )
}

export default ForgotPassword

const styles = StyleSheet.create({})