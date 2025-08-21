import { CustomLightTheme } from "@/constants/Colors";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { PaperProvider, useTheme } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Component that uses theme (must be inside PaperProvider)
function ThemedStatusBar() {
  const theme = useTheme();
  return <StatusBar style={theme.dark ? "light" : "dark"} />;
}

export default function RootLayout() {
  return (
    <PaperProvider theme={CustomLightTheme}>
      <ThemedStatusBar />
      <SafeAreaProvider>
        <Stack screenOptions={{gestureEnabled:false, headerShown:false}}>
          <Stack.Screen name="(main)" />
        </Stack>
      </SafeAreaProvider>
    </PaperProvider>
  )
}
