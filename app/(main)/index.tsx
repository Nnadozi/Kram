import MyButton from '@/components/MyButton'
import Page from '@/components/Page'
import { useUserStore } from '@/stores/userStore'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { StyleSheet } from 'react-native'

const Home = () => {
  const [inputValue, setInputValue] = useState('')
  const { logOut } = useUserStore()

  function handleSignOut() {
    logOut()
    router.navigate('/(auth)/signin')
  }

  return (
    <Page>
      <MyButton
        title='Sign Out'
        onPress={handleSignOut}
      />
    </Page>
  )
}

export default Home

const styles = StyleSheet.create({})