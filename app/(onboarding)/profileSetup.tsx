import MyButton from '@/components/MyButton'
import MyIcon from '@/components/MyIcon'
import MyInput from '@/components/MyInput'
import MyText from '@/components/MyText'
import OnboardScreen from '@/components/OnboardScreen'
import { useUserStore } from '@/stores/userStore'
import { router } from 'expo-router'
import { Timestamp } from 'firebase/firestore'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { SegmentedButtons } from 'react-native-paper'

const profileSetup = () => {
  const { userProfile, setUserProfile} = useUserStore()
  function handleUploadProfilePicture() {
    console.log('uploading profile picture')
  }
  function handleContinue() {
    if (userProfile) {
      setUserProfile({
        ...userProfile,
        updatedAt: Timestamp.now(),
      })
    }
    router.navigate('/(onboarding)/finish')
  }

  return (
    <OnboardScreen
      title="Profile Setup"
      description="Time to create your profile"
      buttonText='Continue'
      onButtonPress={handleContinue}
      progress={0.6}
      style={{gap:5}}
      buttonEnabled={!!(userProfile?.firstName && userProfile?.lastName && userProfile?.graduationYear && userProfile?.bio)}
    >
      <MyIcon color="lightgray" name='account-circle' type='material-community'  size={100} />
      <MyButton title='Upload Profile Picture' onPress={handleUploadProfilePicture} mode='text'/>
      <MyInput
        label="First Name"
        placeholder="First name"
        value={userProfile?.firstName}
        onChangeText={(text) => userProfile && setUserProfile({ ...userProfile, firstName: text })}
        maxLength={50}
      />
      <MyInput
        label="Last Name"
        placeholder="Last name"
        value={userProfile?.lastName}
        onChangeText={(text) => userProfile && setUserProfile({ ...userProfile, lastName: text })}
        maxLength={50}
      />

      <View style = {{marginVertical: 10}}>
        <MyText style={{marginBottom:7.5}} bold gray>Graduation Year</MyText>
        <SegmentedButtons
          value={userProfile?.graduationYear.toString() || '0'}
          onValueChange={(value) => userProfile && setUserProfile({ ...userProfile, graduationYear: parseInt(value) })}
          buttons={[
            { value: '2025', label: '2025', labelStyle: {fontSize: 12.5 } },
            { value: '2026', label: '2026', labelStyle: {fontSize: 12.5} },
            { value: '2027', label: '2027', labelStyle: {fontSize: 12.5} },
            { value: '2028', label: '2028', labelStyle: {fontSize: 12.5} },
          ]} 
        />
      </View>

      <MyInput
        label="Say a bit about yourself!"
        placeholder="Bio (optional)"
        value={userProfile?.bio}
        onChangeText={(text) => userProfile && setUserProfile({ ...userProfile, bio: text })}
        multiline={true}
        style={{height: 150}}
        maxLength={250}
        showMaxLength={true}
      />
    </OnboardScreen>
  )
}

export default profileSetup

const styles = StyleSheet.create({})