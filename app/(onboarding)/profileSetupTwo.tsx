import OnboardScreen from '@/components/OnboardScreen'
import { db } from '@/firebase/firebaseConfig'
import { useUserStore } from '@/stores/userStore'
import { router } from 'expo-router'
import { doc, serverTimestamp, setDoc, Timestamp } from 'firebase/firestore'
import React from 'react'
import { StyleSheet } from 'react-native'

const profileSetupTwo = () => {
  const { userObject, userProfile, setUserProfile, setUserObject} = useUserStore()
  async function createUser() {
    if (!userObject?.uid) { // if no user object, return
      console.error("No user found");
      return;
    } 
    try {
      //mimic profile type
      await setDoc(doc(db, "users", userObject.uid), {
        uid: userObject.uid,
        email: userObject.email,
        school: "test school",
        state: "test state",
        firstName: "test first name",
        lastName: "test last name",
        profilePicture: "test profile picture",
        bio: "test bio",
        year: "test year",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      console.log("User profile created with ID:", userObject.uid);
    } catch (e) {
      console.error("Error creating user profile:", e);
    }
  }

  const handleContinue = () => {
    setUserProfile({
      uid: userObject?.uid || '',
      email: userObject?.email || '',
      school: 'test school',
      state: 'test state',
      firstName: 'test first name',
      lastName: 'test last name',
      profilePicture: 'test profile picture',
      bio: 'test bio',
      year: 'test year',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
    createUser()
    router.navigate('/(onboarding)/finish')
  }
  return (
    <OnboardScreen
      title="Profile Setup"
      description="Let's setup your profile TWO"
      buttonText='Continue'
      onButtonPress={() => {router.navigate('/(onboarding)/finish')}}
      progress={0.75}
    ></OnboardScreen>
  )
}

export default profileSetupTwo

const styles = StyleSheet.create({})