import { Stack } from "expo-router";

//Seperate from onboarding auth
export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="Signin" />
      <Stack.Screen name="Signup" />
    </Stack>
  )
}