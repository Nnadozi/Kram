import ThemeProvider from '@/components/ThemeProvider'
import { Stack } from 'expo-router'

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(main)" />
        <Stack.Screen name="(settings)" />
      </Stack>
    </ThemeProvider>
  )
}
