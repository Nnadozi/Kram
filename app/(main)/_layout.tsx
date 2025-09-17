import { Stack } from 'expo-router';
import { useTheme } from 'react-native-paper';

export default function MainLayout() {
  const {colors} = useTheme();
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="GroupDetail" 
        options={{ 
          headerShown: false,
          presentation: 'card',
          gestureEnabled: true 
        }} 
      />
    </Stack>
  )
}
