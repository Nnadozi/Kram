import { ActivityIndicator, Alert, StyleSheet,  View } from 'react-native'
import React, { useState } from 'react'
import { router, useGlobalSearchParams, useLocalSearchParams } from 'expo-router'
import { useUserStore } from '@/stores/userStore'
import { Page } from '@/components/page'
import { Text } from '@/components/ui/text'
import { Button } from '@/components/ui/button'
import { useEffect } from 'react'
import { db } from '@/firebase/firebaseConfig'
import { doc, getDoc, deleteDoc, arrayRemove, updateDoc } from 'firebase/firestore'
import { Group } from '@/types/Group'

const GroupHome = () => {
  const { groupId } = useGlobalSearchParams()
  const { userProfile, setUserProfile, authUser} = useUserStore()
  const [group, setGroup] = useState<Group | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function fetchGroup() {
      try {
        setIsLoading(true)
        const docRef = doc(db, 'groups', groupId as string)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          console.log('group found successfully', docSnap.data())
          setGroup(docSnap.data() as Group)
        } else {
          Alert.alert('Error', 'Group not found')
          router.back()
        }
      } catch (error) {
        console.error('Error fetching group:', error)
        Alert.alert('Error', 'Failed to load group. Please try again.')
        router.back()
      } finally {
        setIsLoading(false)
      }
    }
    fetchGroup()
  }, [])
  const deleteGroup = () => {
    // Check if current user is the group creator
    if (!authUser || group?.createdBy !== authUser.uid) {
      Alert.alert('Error', 'Only the group creator can delete this group')
      return
    }

    Alert.alert('Delete Group', 'Are you sure you want to delete this group?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', onPress: async () => {
        try {
          setIsLoading(true)
          await deleteDoc(doc(db, 'groups', groupId as string))
          if (userProfile) {
            const updatedGroups = userProfile.groups?.filter((group: Group) => group.id !== groupId) || []     
            setUserProfile({
              groups: updatedGroups
            })
          }
          setIsLoading(false)
          router.back()
        } catch (error) {
          console.error('Error deleting group:', error)
          setIsLoading(false)
          Alert.alert('Error', 'Failed to delete group. Please try again.')
        }
      } }
    ])
  }
  return (
    <Page>
      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
      <Text>{groupId as string}</Text>
      <Text>{group?.name}</Text>
      <Text>{group?.description}</Text>
      <Button onPress={() => router.back()}>
        <Text>Back</Text>
      </Button>
      {authUser && group?.createdBy === authUser.uid && (
        <Button onPress={() => deleteGroup()}>
          <Text>Delete Group</Text>
        </Button>
      )}
    </Page>
  )
}

export default GroupHome