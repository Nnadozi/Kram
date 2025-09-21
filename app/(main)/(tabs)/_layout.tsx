import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useTheme } from 'react-native-paper';

export default function TabsLayout() {
  const {colors} = useTheme();
  
  return (
    <Tabs 
      screenOptions={{
        headerShown: false, 
        tabBarActiveTintColor: colors.primary,
        tabBarStyle: {
          position: 'absolute',
          marginHorizontal: 20,
          bottom: 30,
          height: 60,
          backgroundColor: colors.background,
          borderRadius: 100,
          paddingHorizontal: 10,
          shadowColor: colors.shadow,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          borderTopWidth: 0,
          shadowRadius: 2,
          elevation: 3,
        },
        tabBarLabelStyle: {marginTop: 4, fontSize: 11},
      }}
    >   
      <Tabs.Screen 
        name="Groups" 
        options={{
          tabBarIcon: ({color}) => <FontAwesome6 name="people-group" size={20} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="Discover" 
        options={{
          tabBarIcon: ({color}) => <FontAwesome name="search" size={20} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="Meetups" 
        options={{
          tabBarIcon: ({color}) => <FontAwesome name="calendar" size={20} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="Profile" 
        options={{
          tabBarIcon: ({color}) => <FontAwesome6 name="user" size={20} color={color} />
        }} 
      />
    </Tabs>
  )
}