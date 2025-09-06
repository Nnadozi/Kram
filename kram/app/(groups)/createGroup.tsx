import { StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Page } from '@/components/page'
import { Text } from '@/components/ui/text'
import { Button } from '@/components/ui/button'
import { router } from 'expo-router'
import { Input } from '@/components/ui/input'
import { setDoc } from 'firebase/firestore'
import { doc } from 'firebase/firestore'
import { db } from '@/firebase/firebaseConfig'
import { useUserStore } from '@/stores/userStore'
import { Group } from '@/types/Group'
import uuid from 'react-native-uuid';

const CreateGroup = () => {
  const [groupName, setGroupName] = useState('')
  const [groupDescription, setGroupDescription] = useState('')
  const { userProfile, setUserProfile } = useUserStore()

  const createGroup =  async () => {
    const groupId = uuid.v4() 
    const group: Partial<Group> = {
      id: groupId,
      name: groupName,
      description: groupDescription,
    }
    setDoc(doc(db, 'groups', groupId), { ...group})
    setUserProfile({
      groups: [...userProfile?.groups || [], {
        ...group
      }] as Group[] 
    })
    router.navigate({
      pathname: '/(groups)/groupHome',
      params: { groupId: groupId }
    })
  }

  return (
    <Page >
      <Text>createGroup</Text>
      <Button onPress={() => router.back()}>
        <Text>Back</Text>
      </Button>
      <Input placeholder='Group Name' value={groupName} onChangeText={setGroupName} />
      <Input placeholder='Group Description' value={groupDescription} onChangeText={setGroupDescription} />
      <Button onPress={() => createGroup()}>
        <Text>Create Group</Text>
      </Button>
    </Page>
  )
}

export default CreateGroup

const styles = StyleSheet.create({})