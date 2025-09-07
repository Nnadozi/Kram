import { StyleSheet, View } from 'react-native'
import React from 'react'
import { Page } from '@/components/page'
import { router } from 'expo-router'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'

const EnableNotificationsScreen = () => {
  return (
    <Page>
      <Text>Enable Notifications</Text>
      <Button onPress={() => router.replace('/(onboarding)/Finish')}>
        <Text>Next</Text>
      </Button>
    </Page>
  )
}

export default EnableNotificationsScreen

const styles = StyleSheet.create({})