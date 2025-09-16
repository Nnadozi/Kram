import { CustomLightTheme } from "@/constants/Colors";
import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';

export default function RootLayout() {
  return (
    <PaperProvider theme={CustomLightTheme}>
      <Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(main)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(settings)" />
        <Stack.Screen name="GroupDetail" />
      </Stack>
    </PaperProvider>
  );
}
