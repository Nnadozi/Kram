import { StyleSheet, TouchableOpacity, View,  } from 'react-native'
import React, { useState } from 'react'
import { Page } from '@/components/page'
import { Text } from '@/components/ui/text'
import { useUserStore } from '@/stores/userStore'
import { Group } from '@/types/Group'
import { router } from 'expo-router'
import GroupPreviewCard from '@/components/GroupPreviewCard'
import MyGroupPreviewCard from '@/components/MyGroupPreviewCard'

const Groups = () => {
  const { userProfile, authUser } = useUserStore()
  return (
    <Page>
      <Text variant={'h3'}>My Groups</Text>
      {userProfile?.groups && userProfile.groups.length > 0 ? (
        <>
        <View className='w-full mb-4'>
            <Text variant={'muted'}>Ownerships</Text>
            {userProfile.groups.filter((group: Group) => group.createdBy === authUser?.uid).length === 0 && (
              <Text>No ownerships</Text>
            )}
            {userProfile.groups.filter((group: Group) => group.createdBy === authUser?.uid).map((group: Group) => (
              <MyGroupPreviewCard group={group} key={group.id} />
            ))}
        </View>
        <View className='w-full'>
            <Text variant={'muted'}>Memberships</Text>
            {userProfile.groups.filter((group: Group) => group.createdBy !== authUser?.uid).length === 0 && (
              <Text>No memberships</Text>
            )}
            {userProfile.groups.filter((group: Group) => group.createdBy !== authUser?.uid).map((group: Group) => (
              <MyGroupPreviewCard group={group} key={group.id} />
              ))}
          </View>
          </>
      ) : (
        <Text>No groups</Text>
      )}
    </Page>
  )
}

export default Groups

const styles = StyleSheet.create({})