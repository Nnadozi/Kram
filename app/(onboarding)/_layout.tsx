import { Stack } from "expo-router";


export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{headerShown: false, gestureEnabled: false}}>
      <Stack.Screen name="index" />
      <Stack.Screen name="ProfileSetupOne" />
      <Stack.Screen name="ProfileSetupTwo" />
      <Stack.Screen name="EnableNotifications" />
      <Stack.Screen name="Finish" />
    </Stack>
  )
}