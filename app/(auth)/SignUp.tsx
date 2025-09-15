import CustomButton from '@/components/CustomButton'
import CustomInput from '@/components/CustomInput'
import CustomText from '@/components/CustomText'
import Page from '@/components/Page'
import { auth, db } from '@/firebase/firebaseConfig'
import { useAsyncOperation } from '@/hooks/useAsyncOperation'
import { useUserStore } from '@/stores/userStore'
import { getFirebaseErrorMessage } from '@/util/firebaseErrors'
import { validationRules } from '@/util/validation'
import { router } from 'expo-router'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { useState } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import { IconButton, useTheme } from 'react-native-paper'

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const colors = useTheme().colors;
  const {setUserProfile, setAuthUser} = useUserStore()

  // Validation using your validation utility
  const isEmailValid = validationRules.email(email);
  const isPasswordValid = validationRules.password(password);
  const isFormValid = isEmailValid && isPasswordValid;

  const { execute: signUp, isLoading, error } = useAsyncOperation({
    errorMessage: 'Failed to sign up. Please try again.',
    onSuccess: () => {
      router.push('/(onboarding)/ProfileSetupOne');
    },
    onError: (error) => {
      const errorMessage = getFirebaseErrorMessage(error);
      Alert.alert('Error Signing Up', errorMessage);
    }
  });

  async function handleSignUp() {
    // Validate form before proceeding
    if (!isFormValid) {
      if (!isEmailValid) {
        Alert.alert('Invalid Email', 'Please enter a valid email address');
        return;
      }
      if (!isPasswordValid) {
        Alert.alert('Invalid Password', 'Password must be at least 8 characters long');
        return;
      }
    }

    // Create account in firebase, make user doc in firestore and then navigate to profile setup
    signUp(async () => {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      if (user) {
        setAuthUser(user);
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          onboardingComplete: false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        router.push('/(onboarding)/ProfileSetupOne');
      }
    });
  }
  return (
    <Page>
      <IconButton
        icon="arrow-left"
        onPress={() => router.back()}
        style={{alignSelf: 'flex-start',right:20}}
        
      />
      <View style={styles.header}>
        <CustomText  bold fontSize="2xl">Sign Up</CustomText>
        <CustomText fontSize='sm'>Create an account to get started</CustomText>
      </View>
      <View style = {{width: "100%", marginTop: 5, gap: 5}}>
        <CustomInput
          label="Email"
          value={email} 
          onChangeText={setEmail}
          mode='outlined'
          autoCapitalize='none'
          placeholder='Email' 
        />
        <CustomInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          mode='outlined'
          placeholder='Password'
          autoCapitalize='none'
          secureTextEntry={!showPassword}
          showPasswordToggle={true}
          onTogglePassword={() => setShowPassword(!showPassword)}
        />
      </View>
      <View style={{width: "100%", marginTop: 15, gap: 10}}>
        <CustomButton 
          onPress={handleSignUp}
          disabled={!isFormValid || isLoading}
        >
          {isLoading ? 'Signing Up...' : 'Sign Up'}
        </CustomButton>
        <CustomText gray fontSize='xs' textAlign='center'>or sign up with</CustomText>
        <View style={styles.row}>
          <IconButton
            icon="google"
            onPress={() => {}}
            size={30}
            iconColor={colors.primary}
            style={{borderWidth: 2, borderColor: colors.primary, borderRadius: 1000}}
          />
          <IconButton
            icon="apple"
            onPress={() => {}}
            size={30}
            iconColor={colors.primary}
            style={{borderWidth: 2, borderColor: colors.primary, borderRadius: 1000}}
          />
        </View>
      </View>   
    </Page>
  )
}

export default SignUp

const styles = StyleSheet.create({
  header:{
    width: "100%",
    gap: 5
  },
  row:{
    flexDirection: 'row',
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  }
})