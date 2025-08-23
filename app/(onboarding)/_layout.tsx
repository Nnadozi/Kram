import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{gestureEnabled:false, headerShown:false}}>
      <Stack.Screen name="index" />
      <Stack.Screen name="welcome" />
      <Stack.Screen name="infoCarousel" />
      <Stack.Screen name="findSchool" />
      <Stack.Screen name="verifySchool" />
      <Stack.Screen name="profileSetup" />
      <Stack.Screen name="finish" />
    </Stack>
  )
}