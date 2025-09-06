import { Stack } from "expo-router"
export default function GroupsLayout() {
    return (
        <Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
            <Stack.Screen name="createGroup" />
            <Stack.Screen name="groupHome" />
        </Stack>
    )
}   