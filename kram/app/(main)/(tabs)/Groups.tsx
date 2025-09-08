import { StyleSheet, TouchableOpacity, View,  } from 'react-native'
import React, { useState } from 'react'
import { Page } from '@/components/page'
import { Text } from '@/components/ui/text'
import { useUserStore } from '@/stores/userStore'
import { Group } from '@/types/Group'
import { router } from 'expo-router'
import GroupPreviewCard from '@/components/GroupPreviewCard'
import MyGroupPreviewCard from '@/components/MyGroupPreviewCard'
import { Icon } from '@/components/ui/icon'
import { Trash, Users, X } from 'lucide-react-native'

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
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Icon color={'gray'} as={X} size={75} />
          <Text  variant={'small'} className='text-gray-500 w-4/8 text-center mt-2 font-bold'>Your not in any groups</Text>
          <Text  variant={'small'} className='text-gray-400 w-4/8 text-center mt-1'>Head over to Discover to get started</Text>
        </View>
      )}
    </Page>
  )
}

export default Groups

const styles = StyleSheet.create({})