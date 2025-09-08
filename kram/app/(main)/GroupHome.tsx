import { ActivityIndicator, Alert, StyleSheet, View, FlatList } from 'react-native'
import React, { useState } from 'react'
import { router, useGlobalSearchParams } from 'expo-router'
import { useUserStore } from '@/stores/userStore'
import { Page } from '@/components/page'
import { Text } from '@/components/ui/text'
import { Button } from '@/components/ui/button'
import { useEffect } from 'react'
import { db } from '@/firebase/firebaseConfig'
import { doc, getDoc, deleteDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { Group } from '@/types/Group'
import { Meetup } from '@/types/Meetup'
import MeetupCard from '@/components/MeetupCard'
import CreateMeetupModal from '@/components/CreateMeetupModal'
import uuid from 'react-native-uuid'

const GroupHome = () => {
  const { groupId } = useGlobalSearchParams()
  const { userProfile, setUserProfile, authUser} = useUserStore()
  const [group, setGroup] = useState<Group | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showMeetupModal, setShowMeetupModal] = useState(false)
  const [isCreatingMeetup, setIsCreatingMeetup] = useState(false)

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

  const createMeetup = async (meetupName: string, meetupDescription: string) => {
    if (!meetupName.trim()) {
      Alert.alert('Error', 'Please enter a meetup name')
      return
    }
    if (!authUser || !group) {
      Alert.alert('Error', 'Unable to create meetup')
      return
    }
    try {
      setIsCreatingMeetup(true)
      const meetupId = uuid.v4() 
      const newMeetup: Partial<Meetup> = {
        id: meetupId,
        name: meetupName.trim(),
        description: meetupDescription.trim(),
      }
      const groupRef = doc(db, 'groups', groupId as string)
      const updatedGroup = {
        ...group,
        meetups: [...(group.meetups || []), newMeetup as Meetup]
      }
      await updateDoc(groupRef, {
        meetups: updatedGroup.meetups
      })
      if (userProfile) {
        const updatedUserGroups = userProfile.groups?.map(g => 
          g.id === groupId ? updatedGroup : g
        ) || []   
        setUserProfile({
          groups: updatedUserGroups
        })
      }
      setGroup(updatedGroup)
      setShowMeetupModal(false)
      Alert.alert('Success', 'Meetup created successfully!')
    } catch (error) {
      console.error('Error creating meetup:', error)
      Alert.alert('Error', 'Failed to create meetup. Please try again.')
    } finally {
      setIsCreatingMeetup(false)
    }
  }

  const handleMeetupPress = (meetup: Meetup) => {
    console.log('Meetup pressed:', meetup.name)
  }

  return (
    <Page>
      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
      
      <Text className='text-2xl font-bold'>{group?.name}</Text>
      <Text className='text-gray-600 mb-4'>{group?.description}</Text>
      
      <View className='flex-row space-x-2 mb-4'>
        <Button onPress={() => router.back()}>
          <Text>Back</Text>
        </Button>
        <Button onPress={() => setShowMeetupModal(true)}>
          <Text>Schedule Meetup</Text>
        </Button>
        {authUser && group?.createdBy === authUser.uid && (
          <Button onPress={() => deleteGroup()}>
            <Text>Delete Group</Text>
          </Button>
        )}
      </View>

      <Text className='text-lg font-semibold mb-2'>Meetups</Text>
      {group?.meetups && group.meetups.length > 0 ? (
        <FlatList
          data={group.meetups}
          renderItem={({ item }) => (
            <MeetupCard 
              meetup={item} 
              onPress={handleMeetupPress}
            />
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text className='text-gray-500 text-center py-4'>No meetups scheduled yet</Text>
      )}

      <CreateMeetupModal
        visible={showMeetupModal}
        onClose={() => setShowMeetupModal(false)}
        onCreate={createMeetup}
        isLoading={isCreatingMeetup}
      />
    </Page>
  )
}

export default GroupHome