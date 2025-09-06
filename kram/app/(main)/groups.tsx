import { StyleSheet, View,  } from 'react-native'
import React from 'react'
import { Page } from '@/components/page'
import { Text } from '@/components/ui/text'
import { useUserStore } from '@/stores/userStore'
import { Group } from '@/types/Group'

const Groups = () => {
  const { userProfile } = useUserStore()
  return (
    <Page>
      {userProfile?.groups && userProfile.groups.length > 0 ? (
        <View>
          {userProfile.groups.map((group: Group) => (
            <Text key={group.id}>{group.name}</Text>
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