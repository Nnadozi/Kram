import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Group } from '@/types/Group'
import { router } from 'expo-router'
import { Text } from '@/components/ui/text'

interface GroupPreviewCardProps {
  group: Group
  isJoined: boolean
}

const GroupPreviewCard = ({ group, isJoined }: GroupPreviewCardProps) => {
  return (
    <TouchableOpacity onPress={() => router.push({
      pathname: '/(main)/GroupHome',
      params: { groupId: group.id }
    })}>
      <Text>{group.name}</Text>
      <Text>{isJoined ? 'I AM PART OF THIS GROUP' : 'I HAVE NOT JOINED THIS GROUP'}</Text>
    </TouchableOpacity>
  )
}

export default GroupPreviewCard

const styles = StyleSheet.create({})