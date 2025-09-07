import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { Text } from '@/components/ui/text'
import { Page } from '@/components/page'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Icon } from '@/components/ui/icon'
import { Settings } from 'lucide-react-native'
import { useUserStore } from '@/stores/userStore'
import { Button } from '@/components/ui/button'
import { Group } from '@/types/Group'

const Profile = () => {
  const { userProfile, signOut, deleteAccount } = useUserStore()

  const renderValue = (key: string, value: any) => {
    if (Array.isArray(value)) {
      if (key === 'groups') {
        // Special handling for groups array
        return value.length > 0 ? value.map((group: Group) => group.name).join(', ') : 'No groups'
      }
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

  const deleteAccountHandler = () => {
    Alert.alert('Delete Account', 'Are you sure you want to delete your account?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', onPress: () => deleteAccount() }
    ])
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
      <Button onPress={deleteAccountHandler}>
        <Text>Delete Account</Text>
      </Button>
    </Page>
  )
}

export default Profile

const styles = StyleSheet.create({})