import CustomButton from '@/components/CustomButton'
import CustomInput from '@/components/CustomInput'
import CustomText from '@/components/CustomText'
import Page from '@/components/Page'
import { useAsyncOperation } from '@/hooks/useAsyncOperation'
import { authService } from '@/services/authService'
import { useUserStore } from '@/stores/userStore'
import { router } from 'expo-router'
import { useState } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import { IconButton, useTheme } from 'react-native-paper'

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const colors = useTheme().colors;
  const { setAuthUser } = useUserStore()

  const { execute: signUp, isLoading } = useAsyncOperation({
    onSuccess: () => {
      router.replace('/(onboarding)/ProfileSetupOne');
    },
    onError: (error) => {
      Alert.alert('Error Signing Up', error.message);
    }
  });

  // Clean UI logic - validation and business logic now handled by service
  async function handleSignUp() {
    signUp(async () => {
      const user = await authService.signUp(email, password);
      setAuthUser(user);
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
          disabled={isLoading}
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