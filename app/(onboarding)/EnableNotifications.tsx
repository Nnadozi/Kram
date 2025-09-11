import OnboardingPage from '@/components/OnboardingPage'
import { router } from 'expo-router'
import { StyleSheet } from 'react-native'


export default function EnableNotifications() {
  return (
    <OnboardingPage 
    title='Enable Notifications' 
    description="Keep up to date with the latest updates"
    progress={0.75} 
    onButtonPress={() => router.navigate('/(onboarding)/Finish')}
    />
  )
}

const styles = StyleSheet.create({})