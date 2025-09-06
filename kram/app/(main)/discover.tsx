import { StyleSheet,  } from 'react-native'
import React from 'react'
import { Page } from '@/components/page'
import { Text } from '@/components/ui/text'
import { Button } from '@/components/ui/button'
import { router } from 'expo-router'

const Discover = () => {
  return (
    <Page>
      <Text>Discover</Text>
      <Button onPress={() => router.navigate('/(groups)/createGroup')}>
        <Text>Create Group</Text>
      </Button>
    </Page>
  )
}

export default Discover