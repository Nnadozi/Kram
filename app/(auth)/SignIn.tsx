import CustomButton from '@/components/CustomButton';
import CustomInput from '@/components/CustomInput';
import CustomText from '@/components/CustomText';
import Page from '@/components/Page';
import { auth, db } from '@/firebase/firebaseConfig';
import { useAsyncOperation } from '@/hooks/useAsyncOperation';
import { useUserStore } from '@/stores/userStore';
import { getFirebaseErrorMessage } from '@/util/firebaseErrors';
import { validationRules } from '@/util/validation';
import { router } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';


const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const colors = useTheme().colors;
  const { setAuthUser, setUserProfile } = useUserStore();
  const [showPassword, setShowPassword] = useState(false);
    // Validation using your validation utility
    const isEmailValid = validationRules.email(email);
    const isFormValid = isEmailValid && password.length > 0;

    
  const { execute: signIn, isLoading, error } = useAsyncOperation({
    errorMessage: 'Failed to sign in. Please try again.',
    onSuccess: () => {
      router.push('/(main)/(tabs)/Groups');
    },
    onError: (error) => {
      console.log(error);
      const errorMessage = getFirebaseErrorMessage(error);
      Alert.alert('Error Signing In', errorMessage);
    }
  });

  async function handleSignIn() {
    if (!isFormValid) {
      if (!isEmailValid) {
        Alert.alert('Invalid Email', 'Please enter a valid email address');
        return;
      }
77
    }
    signIn(async () => {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      if (user) {
        setAuthUser(user);
      }
        // Fetch user profile from Firestore
        const userDocRef = doc(db, 'users', user.uid)
        const userDoc = await getDoc(userDocRef)
        
        if (userDoc.exists()) {
          const profileData = userDoc.data()
          setUserProfile(profileData)
          
          // Navigate based on onboarding status
          if (!profileData?.onboardingComplete) {
            router.replace('/(onboarding)/ProfileSetupOne')
          } else {
            router.replace('/(main)/(tabs)/Groups')
          }
        } else {
          // No profile exists, start onboarding
          router.replace('/(onboarding)/ProfileSetupOne')
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
        <CustomText  bold fontSize="2xl">Sign In</CustomText>
        <CustomText fontSize='sm'>Welcome back!</CustomText>
      </View>
      <View style = {{width: "100%", marginTop: 5, gap: 5}}>
        <CustomInput
          label="Email"
          value={email} 
          onChangeText={setEmail}
          autoCapitalize='none'
          mode='outlined'
          placeholder='Email'
        />
        <CustomInput
          label="Password"
          value={password}
          secureTextEntry={!showPassword}
          showPasswordToggle={true}
          onTogglePassword={() => setShowPassword(!showPassword)}
          onChangeText={setPassword}
          mode='outlined'
          placeholder='Password'
        />
        <CustomText style={{marginVertical: 5}} textAlign='right' fontSize='xs' primary onPress={() => router.push('/(auth)/ForgotPassword')}>
          Forgot Password
          </CustomText>
      </View>
      <View style={{width: "100%", marginTop: 15, gap: 10}}>
        <CustomButton onPress={handleSignIn} disabled={!isFormValid || isLoading}>{isLoading ? 'Signing In...' : 'Sign In'}</CustomButton>
        <CustomText gray fontSize='xs' textAlign='center'>or sign in with</CustomText>
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
        <CustomText style={{marginTop: 20}} gray fontSize='sm' textAlign='center'>Don't have an account? <CustomText fontSize='sm' bold primary onPress={() => router.replace('/(auth)/SignUp')}>Sign Up</CustomText></CustomText>
      </View>   
    </Page>
  )
}

export default Signin

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