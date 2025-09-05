import { StyleSheet, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { Text } from '@/components/ui/text'
import { Page } from '@/components/page'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Icon } from '@/components/ui/icon'
import { Settings } from 'lucide-react-native'

const Profile = () => {
  return (
    <Page className='items-center justify-start'>
      <View className='w-full flex-row items-center justify-between mb-3'>
        <View/>
        <Text className='font-bold' variant={'h4'}>Profile</Text>
        <TouchableOpacity>
          <Icon as={Settings} size={25} />
        </TouchableOpacity>
      </View>
      <Avatar className='size-40' alt="Zach Nugent's Avatar">
        <AvatarImage source={{ uri: 'https://github.com/mrzachnugent.png' }} />
        <AvatarFallback>
          <Text>CN</Text>
        </AvatarFallback>
      </Avatar>
    </Page>
  )
}

export default Profile

const styles = StyleSheet.create({})