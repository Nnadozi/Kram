import { StyleSheet, Alert } from 'react-native'
import React, { useState } from 'react'
import { Page } from '@/components/page'
import { Text } from '@/components/ui/text'
import { Button } from '@/components/ui/button'
import { router } from 'expo-router'
import { Input } from '@/components/ui/input'
import { serverTimestamp, setDoc } from 'firebase/firestore'
import { doc } from 'firebase/firestore'
import { db } from '@/firebase/firebaseConfig'
import { useUserStore } from '@/stores/userStore'
import { Group } from '@/types/Group'
import uuid from 'react-native-uuid';

const CreateGroup = () => {
  const [groupName, setGroupName] = useState('')
  const [groupDescription, setGroupDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { userProfile, setUserProfile, authUser } = useUserStore()

  const createGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert('Error', 'Please enter a group name')
      return
    }
    if (!authUser) {
      Alert.alert('Error', 'You must be logged in to create a group')
      return
    }

    try {
      setIsLoading(true)
      const groupId = uuid.v4() 
      const group = {
        id: groupId,
        name: groupName.trim(),
        description: groupDescription.trim(),
        createdBy: authUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        members: [userProfile],
      }
      await setDoc(doc(db, 'groups', groupId), { ...group})
      setUserProfile({
        groups: [...userProfile?.groups || [], {
          ...group,
          createdAt: new Date(),
          updatedAt: new Date()
        }] as Group[] 
      })
      
      router.replace({
        pathname: '/(main)/GroupHome',
        params: { groupId: groupId }
      })
    } catch (error) {
      console.error('Error creating group:', error)
      Alert.alert('Error', 'Failed to create group. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Page >
      <Text>createGroup</Text>
      <Button onPress={() => router.back()}>
        <Text>Back</Text>
      </Button>
      <Input placeholder='Group Name' value={groupName} onChangeText={setGroupName} />
      <Input placeholder='Group Description' value={groupDescription} onChangeText={setGroupDescription} />
      <Button onPress={() => createGroup()} disabled={isLoading}>
        <Text>{isLoading ? 'Creating...' : 'Create Group'}</Text>
      </Button>
    </Page>
  )
}

export default CreateGroup

const styles = StyleSheet.create({})