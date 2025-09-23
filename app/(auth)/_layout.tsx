import { Stack } from "expo-router";
export default function AuthLayout() {
  return (
    <Stack screenOptions={{headerShown: false, gestureEnabled: false}}>
      <Stack.Screen name="index" />
      <Stack.Screen name="SignIn" />
      <Stack.Screen name="SignUp" />
      <Stack.Screen name="ForgotPassword" />
      <Stack.Screen name="EmailVerification" />
    </Stack>
  )
}