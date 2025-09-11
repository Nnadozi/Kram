import CustomInput from '@/components/CustomInput'
import OnboardingPage from '@/components/OnboardingPage'
import { useUserStore } from '@/stores/userStore'
import { router } from 'expo-router'
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'

const ProfileSetupTwo = () => {
  const { setUserProfile } = useUserStore()
  const [majors, setMajors] = useState('')
  const [minors, setMinors] = useState('')
  const [bio, setBio] = useState('')
  const [avatar, setAvatar] = useState('')
  const handleButtonPress = () => {
    setUserProfile({
      majors: majors.split(',').map(m => m.trim()).filter(m => m),
      minors: minors.split(',').map(m => m.trim()).filter(m => m),
      bio: bio,
      avatar: avatar,
    })
    router.navigate('/(onboarding)/EnableNotifications')
  }
  return (
    <OnboardingPage 
    title='A Few More Details' 
    description="Finish setting up your profile"
    progress={0.5} 
    onButtonPress={handleButtonPress}
    >
      <View style={{width: "100%", marginTop: 5, gap: 5, flex: 1}}> 
        <CustomInput
          label='Majors'
          value={majors}
          onChangeText={setMajors}
          maxLength={50}
        />
        <CustomInput
          label='Minors'
          value={minors}
          onChangeText={setMinors}
          maxLength={50}
        />
        <CustomInput
          label='Short Bio'
          value={bio}
          onChangeText={setBio}
          maxLength={200}
          style={{height:100}}
          multiline
          showCharCounter
        />
        <CustomInput
          label='Avatar'
          value={avatar}
          onChangeText={setAvatar}
          maxLength={500}
        />
      </View>
    </OnboardingPage>
    //majors, minors, bio, avatar
  )
}

export default ProfileSetupTwo

const styles = StyleSheet.create({})