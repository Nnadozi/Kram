import { Stack } from "expo-router";

export default function SettingsLayout() {
  return (
    <Stack screenOptions={{headerShown: false, gestureEnabled: false}}>
      <Stack.Screen name="index" />
      <Stack.Screen name="Account" />
      <Stack.Screen name="Notifications" />
      <Stack.Screen name="Feedback" />
    </Stack>
  )
}