import CustomButton from '@/components/CustomButton';
import CustomInput from '@/components/CustomInput';
import CustomText from '@/components/CustomText';
import Page from '@/components/Page';
import { useAsyncOperation } from '@/hooks/useAsyncOperation';
import { useEmailVerificationDeadline } from '@/hooks/useEmailVerificationDeadline';
import { authService } from '@/services/authService';
import { userService } from '@/services/userService';
import { useUserStore } from '@/stores/userStore';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';


const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const colors = useTheme().colors;
  const { setAuthUser, setUserProfile, pendingAccountDeletion, setPendingAccountDeletion, deleteAccount, clearEmailVerificationDeadline } = useUserStore();
  const { shouldShowEmailVerification } = useEmailVerificationDeadline();
  const [showPassword, setShowPassword] = useState(false);

  const { execute: signIn, isLoading } = useAsyncOperation({
    onError: (error) => {
      Alert.alert('Error Signing In', error.message);
    }
  });

  // Clean UI logic - validation and business logic now handled by service
  async function handleSignIn() {
    signIn(async () => {
      const user = await authService.signIn(email, password);
      setAuthUser(user);
      
      // Check if account deletion is pending
      if (pendingAccountDeletion) {
        setPendingAccountDeletion(false);
        
        // Show confirmation alert for account deletion
        Alert.alert(
          'Delete Account',
          'You have successfully signed in. Do you want to proceed with deleting your account? This action cannot be undone.',
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => {
                // Navigate to main app
                router.replace('/(main)/(tabs)/Groups');
              }
            },
            {
              text: 'Delete Account',
              style: 'destructive',
              onPress: async () => {
                try {
                  await deleteAccount();
                  // Show success confirmation
                  Alert.alert(
                    'Account Deleted',
                    'Your account has been successfully deleted.',
                    [
                      {
                        text: 'OK',
                        onPress: () => {
                          // Navigate to onboarding
                          router.replace('/(onboarding)');
                        }
                      }
                    ]
                  );
                } catch (error) {
                  console.error('Error deleting account after sign-in:', error);
                  Alert.alert(
                    'Error',
                    'Failed to delete account. Please try again.',
                    [
                      {
                        text: 'OK',
                        onPress: () => {
                          // Navigate to main app
                          router.replace('/(main)/(tabs)/Groups');
                        }
                      }
                    ]
                  );
                }
              }
            }
          ]
        );
        return;
      }
      
      // Fetch user profile and handle navigation
      const userProfile = await userService.getUserProfile(user.uid);
      
      // Check email verification first
      if (!user.emailVerified && shouldShowEmailVerification) {
        router.replace('/(auth)/EmailVerification');
        return;
      }
      
      // If email is verified, clear any existing deadline
      if (user.emailVerified) {
        clearEmailVerificationDeadline();
      }
      
      if (userProfile) {
        setUserProfile(userProfile);
        
        // Navigate based on onboarding status
        if (!userProfile.onboardingComplete) {
          router.replace('/(onboarding)/ProfileSetupOne');
        } else {
          router.replace('/(main)/(tabs)/Groups');
        }
      } else {
        // No profile exists, start onboarding
        router.replace('/(onboarding)/ProfileSetupOne');
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
        <CustomText gray fontSize='xs' textAlign='right' onPress={() => router.push("/(auth)/ForgotPassword")}>Forgot Password?</CustomText>
      </View>
      <View style={{width: "100%", marginTop: 15, gap: 10}}>
        <CustomButton 
          onPress={handleSignIn}
          loading={isLoading}
          loadingText="Signing In..."
        >
          Sign In
        </CustomButton>
        <CustomText primary fontSize='xs' textAlign='center'>or sign in with</CustomText>
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
      <CustomText style={{marginTop: 30}} gray fontSize='xs' textAlign='center'>New User? 
        <CustomText fontSize='xs' primary bold onPress={() => router.replace("/(auth)/SignUp")}> Sign Up</CustomText>
      </CustomText>
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