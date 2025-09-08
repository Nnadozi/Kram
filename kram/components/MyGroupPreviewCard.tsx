import { StyleSheet,  View } from 'react-native'
import React from 'react'
import { Group } from '@/types/Group'
import { router } from 'expo-router'
import { TouchableOpacity } from 'react-native'
import { Text } from '@/components/ui/text'
import { useUserStore } from '@/stores/userStore'
import {NAV_THEME} from "@/lib/theme"

interface MyGroupPreviewCardProps {
  group: Group
}

const MyGroupPreviewCard = ({ group }: MyGroupPreviewCardProps) => {
  const { authUser } = useUserStore()
  return (
    <TouchableOpacity style={[styles.con, { borderColor: NAV_THEME.light.colors.border}]} onPress={() => router.push({
      pathname: '/(main)/GroupHome',
      params: { groupId: group.id }
    })}>
      <Text className='text-sm font-bold'>{group.name}</Text>
    </TouchableOpacity>
  )
}

export default MyGroupPreviewCard

const styles = StyleSheet.create({
  con:{
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 5,
    backgroundColor: 'white',
  }
})