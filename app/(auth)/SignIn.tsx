import LoadingButton from '@/components/LoadingButton';
import CustomInput from '@/components/CustomInput';
import CustomText from '@/components/CustomText';
import Page from '@/components/Page';
import { useAsyncOperation } from '@/hooks/useAsyncOperation';
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
  const { setAuthUser, setUserProfile } = useUserStore();
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
      
      // Fetch user profile and handle navigation
      const userProfile = await userService.getUserProfile(user.uid);
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
      </View>
      <View style={{width: "100%", marginTop: 15, gap: 10}}>
        <LoadingButton 
          onPress={handleSignIn}
          loading={isLoading}
          loadingText="Signing In..."
        >
          Sign In
        </LoadingButton>
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