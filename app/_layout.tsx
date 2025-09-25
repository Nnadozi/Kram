import { OfflineBanner } from '@/components/OfflineBanner'
import ThemeProvider from '@/components/ThemeProvider'
import { NetworkProvider } from '@/contexts/NetworkContext'
import { Stack } from 'expo-router'
import { View } from 'react-native'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
export default function RootLayout() {
  return (
    <>
      <SafeAreaProvider>
        <KeyboardProvider>
          <ThemeProvider>
            <NetworkProvider>
              <View style={{ flex: 1 }}>
                <OfflineBanner />
                <Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
                  <Stack.Screen name="index" />
                  <Stack.Screen name="(onboarding)" />
                  <Stack.Screen name="(auth)" />
                  <Stack.Screen name="(main)" />
                  <Stack.Screen name="(settings)" />
                </Stack>
              </View>
            </NetworkProvider>
          </ThemeProvider>
        </KeyboardProvider>
      </SafeAreaProvider>
      <Toast />
     </>
  )
}
