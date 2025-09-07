import { Tabs } from "expo-router";
import { Icon } from "@/components/ui/icon";
import { UserIcon, CalendarIcon, Search, Users } from "lucide-react-native";

export default function TabsLayout() {
    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen options={{title: 'Groups', tabBarIcon: () => <Icon as={Users} />}} name="Groups" />
            <Tabs.Screen options={{title: 'Discover', tabBarIcon: () => <Icon as={Search} />}} name="Discover" />
            <Tabs.Screen options={{title: 'Meetup', tabBarIcon: () => <Icon as={CalendarIcon} />}} name="Meetup" />
            <Tabs.Screen options={{title: 'Profile', tabBarIcon: () => <Icon as={UserIcon} />}} name="Profile" />
        </Tabs>
    )
}
