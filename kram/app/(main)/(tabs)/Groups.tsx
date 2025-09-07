import { StyleSheet, TouchableOpacity, View,  } from 'react-native'
import React from 'react'
import { Page } from '@/components/page'
import { Text } from '@/components/ui/text'
import { useUserStore } from '@/stores/userStore'
import { Group } from '@/types/Group'
import { router } from 'expo-router'

const Groups = () => {
  const { userProfile } = useUserStore()
  return (
    <Page>
      <Text variant={'h3'}>My Groups</Text>
      {userProfile?.groups && userProfile.groups.length > 0 ? (
        <View>
          {userProfile.groups.map((group: Group) => (
            <TouchableOpacity onPress={() => router.push({
              pathname: '/(groups)/groupHome',
              params: { groupId: group.id }
            })} key={group.id}>
              <Text key={group.id}>{group.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <Text>No groups</Text>
      )}
    </Page>
  )
}

export default Groups

const styles = StyleSheet.create({})