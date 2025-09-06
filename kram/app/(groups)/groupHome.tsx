import { StyleSheet,  View } from 'react-native'
import React from 'react'
import { router, useGlobalSearchParams, useLocalSearchParams } from 'expo-router'
import { useUserStore } from '@/stores/userStore'
import { Page } from '@/components/page'
import { Text } from '@/components/ui/text'
import { Button } from '@/components/ui/button'

const GroupHome = () => {
  const { groupId } = useGlobalSearchParams()
  return (
    <Page>
      <Text>groupHome</Text>
      <Text>{groupId as string}</Text>
      <Button onPress={() => router.navigate('/(main)/groups')}>
        <Text>Back Home</Text>
      </Button>
    </Page>
  )
}

export default GroupHome