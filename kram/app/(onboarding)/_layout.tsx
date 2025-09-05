import { Stack } from "expo-router";

export default function OnboardingLayout() {
    return (
        <Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="profileSetupOne" />
            <Stack.Screen name="profileSetupTwo" />
            <Stack.Screen name="enableNotifications" />
            <Stack.Screen name="finish" />
        </Stack>
    )
}