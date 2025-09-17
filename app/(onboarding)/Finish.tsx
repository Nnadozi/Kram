import OnboardingPage from '@/components/OnboardingPage'
import { useUserStore } from '@/stores/userStore'
import { router } from 'expo-router'
import { useEffect, useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import ConfettiCannon from 'react-native-confetti-cannon'

const Finish = () => {
  const confettiRef = useRef<ConfettiCannon>(null)
  const { setUserProfile } = useUserStore()

  useEffect(() => {
    if (confettiRef.current) {
      confettiRef.current.start()
    }
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <OnboardingPage 
        title='Your All Set!' 
        description="Enjoy the app!"
        progress={1} 
        onButtonPress={() => {
          router.navigate('/(main)/(tabs)/Groups')
          setUserProfile({ onboardingComplete: true })
        }}
        buttonTitle='Get Started'
      />
      <ConfettiCannon
        ref={confettiRef}
        count={200}
        origin={{ x: -10, y: 0 }}
        fadeOut={true}
        autoStart={false}
      />
    </View>
  )
}

export default Finish

const styles = StyleSheet.create({})