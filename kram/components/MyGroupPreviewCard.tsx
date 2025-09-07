import { StyleSheet,  View } from 'react-native'
import React from 'react'
import { Group } from '@/types/Group'
import { router } from 'expo-router'
import { TouchableOpacity } from 'react-native'
import { Text } from '@/components/ui/text'
import { useUserStore } from '@/stores/userStore'

interface MyGroupPreviewCardProps {
  group: Group
}

const MyGroupPreviewCard = ({ group }: MyGroupPreviewCardProps) => {
  const { authUser } = useUserStore()
  return (
    <TouchableOpacity onPress={() => router.push({
      pathname: '/(main)/GroupHome',
      params: { groupId: group.id }
    })}>
      <Text>{group.name}</Text>
      <Text>{group.createdBy === authUser?.uid ? 'I OWN THIS GROUP' : 'I AM A MEMBER OF THIS GROUP'}</Text>
    </TouchableOpacity>
  )
}

export default MyGroupPreviewCard

const styles = StyleSheet.create({})