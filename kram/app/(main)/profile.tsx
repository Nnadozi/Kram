import { StyleSheet, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { Text } from '@/components/ui/text'
import { Page } from '@/components/page'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Icon } from '@/components/ui/icon'
import { Settings } from 'lucide-react-native'
import { useUserStore } from '@/stores/userStore'
import { Button } from '@/components/ui/button'

const Profile = () => {
  const { userProfile, signOut } = useUserStore()

  const renderValue = (key: string, value: any) => {
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(', ') : 'None'
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No'
    }
    if (typeof value === 'object' && value !== null) {
      return 'Object data'
    }
    return value?.toString() || 'Not set'
  }
  
  return (
    <Page className='items-center justify-start'>
      {userProfile ? (
        <View className='w-full space-y-4ßß'>
          {Object.entries(userProfile).map(([key, value]) => (
            <Text key={key}>
              {key}: {renderValue(key, value)}
            </Text>
          ))}
        </View>
      ) : (
        <Text>No profile data available</Text>
      )}
      <Button onPress={signOut}>
        <Text>Sign out</Text>
      </Button>
    </Page>
  )
}

export default Profile

const styles = StyleSheet.create({})