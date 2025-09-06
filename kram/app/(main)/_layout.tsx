import { Stack, Tabs } from "expo-router";
import { Icon } from "@/components/ui/icon";
import { UserIcon , CalendarIcon, Search, Group, Users} from "lucide-react-native";

export default function MainLayout() {
    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen options={{title: 'Groups', tabBarIcon: () => <Icon  as={Users} />}} name="groups" />
            <Tabs.Screen options={{title: 'Discover', tabBarIcon: () => <Icon as={Search} />}} name="discover" />
            <Tabs.Screen options={{title: 'Meetup', tabBarIcon: () => <Icon as={CalendarIcon} />}} name="meetup" />
            <Tabs.Screen options={{title: 'Profile', tabBarIcon: () => <Icon as={UserIcon} />}} name="profile" />
        </Tabs>
    )
}