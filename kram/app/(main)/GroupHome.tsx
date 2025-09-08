import { ActivityIndicator, Alert, View, FlatList, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { router, useGlobalSearchParams } from 'expo-router'
import { useUserStore } from '@/stores/userStore'
import { Page } from '@/components/page'
import { Text } from '@/components/ui/text'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { db } from '@/firebase/firebaseConfig'
import { doc, getDoc, deleteDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { Group } from '@/types/Group'
import { Meetup } from '@/types/Meetup'
import { UserProfile } from '@/types/UserProfile'
import MeetupCard from '@/components/MeetupCard'
import CreateMeetupModal from '@/components/CreateMeetupModal'
import { useAsyncOperation } from '@/hooks/useAsyncOperation'
import uuid from 'react-native-uuid'

const GroupHome = () => {
  const { groupId } = useGlobalSearchParams()
  const { userProfile, setUserProfile, authUser} = useUserStore()
  const [group, setGroup] = useState<Group | null>(null)
  const [showMeetupModal, setShowMeetupModal] = useState(false)
  
  // Custom hooks
  const { execute: fetchGroup, isLoading } = useAsyncOperation({
    errorMessage: 'Failed to load group. Please try again.',
    onSuccess: (groupData) => setGroup(groupData),
    onError: () => router.back()
  })
  
  const { execute: deleteGroup, isLoading: isDeleting } = useAsyncOperation({
    errorMessage: 'Failed to delete group. Please try again.',
    onSuccess: () => router.back()
  })
  
  const { execute: createMeetup, isLoading: isCreatingMeetup } = useAsyncOperation({
    errorMessage: 'Failed to create meetup. Please try again.',
    onSuccess: () => {
      setShowMeetupModal(false)
      // Refresh group data after creating meetup
      fetchGroup(async () => {
        const docRef = doc(db, 'groups', groupId as string)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          return docSnap.data() as Group
        } else {
          throw new Error('Group not found')
        }
      })
    }
  })

  const { execute: joinMeetup, isLoading: isJoiningMeetup } = useAsyncOperation({
    errorMessage: 'Failed to join meetup. Please try again.',
    onSuccess: () => {
      Alert.alert('Success', 'You have successfully joined the meetup!')
      // Refresh group data after joining meetup
      fetchGroup(async () => {
        const docRef = doc(db, 'groups', groupId as string)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          return docSnap.data() as Group
        } else {
          throw new Error('Group not found')
        }
      })
    }
  })

  // Fetch group on mount
  React.useEffect(() => {
    fetchGroup(async () => {
      const docRef = doc(db, 'groups', groupId as string)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        return docSnap.data() as Group
      } else {
        throw new Error('Group not found')
      }
    })
  }, [groupId])
  
  const handleDeleteGroup = () => {
    if (!authUser || group?.createdBy !== authUser.uid) {
      Alert.alert('Error', 'Only the group creator can delete this group')
      return
    }

    Alert.alert('Delete Group', 'Are you sure you want to delete this group?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', onPress: () => deleteGroup(async () => {
        await deleteDoc(doc(db, 'groups', groupId as string))
        if (userProfile) {
          const updatedGroups = userProfile.groups?.filter((group: Group) => group.id !== groupId) || []     
          setUserProfile({ groups: updatedGroups })
        }
      })}
    ])
  }

  const handleCreateMeetup = (meetupData: Partial<Meetup>) => {
    if (!authUser || !group) {
      Alert.alert('Error', 'Unable to create meetup')
      return
    }
    
    createMeetup(async () => {
      const meetupId = uuid.v4() 
      const now = new Date()
      const newMeetup: Meetup = {
        id: meetupId,
        name: meetupData.name!,
        description: meetupData.description || '',
        type: meetupData.type!,
        location: meetupData.location || '',
        date: meetupData.date!,
        time: meetupData.time!,
        length: meetupData.length!,
        attendees: meetupData.attendees || [],
        groupId: groupId as string,
        createdBy: authUser.uid,
        createdAt: now,
        updatedAt: now,
        cancelled: false,
      }
      const groupRef = doc(db, 'groups', groupId as string)
      const updatedGroup = {
        ...group,
        meetups: [...(group.meetups || []), newMeetup]
      }
      await updateDoc(groupRef, {
        meetups: updatedGroup.meetups
      })
      if (userProfile) {
        const updatedUserGroups = userProfile.groups?.map(g => 
          g.id === groupId ? updatedGroup : g
        ) || []   
        setUserProfile({ groups: updatedUserGroups })
      }
      setGroup(updatedGroup)
      Alert.alert('Success', 'Meetup created successfully!')
    })
  }

  const handleMeetupPress = (meetup: Meetup) => {
    console.log('Meetup pressed:', meetup.name)
  }

  const handleJoinMeetup = (meetup: Meetup) => {
    if (!authUser || !userProfile) {
      Alert.alert('Error', 'You must be logged in to join a meetup')
      return
    }

    // Check if user is already attending
    const isAlreadyAttending = meetup.attendees?.some(attendee => attendee.id === authUser.uid)
    if (isAlreadyAttending) {
      Alert.alert('Info', 'You are already attending this meetup')
      return
    }

    joinMeetup(async () => {
      // Add user to meetup attendees
      const updatedAttendees = [...(meetup.attendees || []), userProfile]
      
      // Update the specific meetup in the group's meetups array
      const updatedMeetups = group?.meetups?.map(m => 
        m.id === meetup.id 
          ? { ...m, attendees: updatedAttendees }
          : m
      ) || []

      // Update group in Firebase
      const groupRef = doc(db, 'groups', groupId as string)
      await updateDoc(groupRef, {
        meetups: updatedMeetups
      })

      // Update local group state
      if (group) {
        const updatedGroup = {
          ...group,
          meetups: updatedMeetups
        }
        setGroup(updatedGroup)

        // Update user profile with new meetup attendance
        if (userProfile) {
          const updatedUserGroups = userProfile.groups?.map(g => 
            g.id === groupId ? updatedGroup : g
          ) || []
          setUserProfile({ groups: updatedUserGroups })
        }
      }
    })
  }

  // Helper function to get the group creator
  const getGroupCreator = (): UserProfile | null => {
    if (!group?.createdBy || !group?.members) return null
    // Find creator by matching the createdBy field with the member's id (Firebase UID)
    return group.members.find(member => member.id === group.createdBy) || null
  }

  // Helper function to get other members (excluding creator)
  const getOtherMembers = (): UserProfile[] => {
    if (!group?.members || !group?.createdBy) return []
    return group.members.filter(member => member.id !== group.createdBy)
  }

  // Helper function to get member initials
  const getMemberInitials = (member: UserProfile): string => {
    const firstInitial = member.firstName?.charAt(0)?.toUpperCase() || ''
    const lastInitial = member.lastName?.charAt(0)?.toUpperCase() || ''
    return firstInitial + lastInitial
  }

  const creator = getGroupCreator()
  const otherMembers = getOtherMembers()

  return (
    <Page>
      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Group Header */}
        <View className="mb-6">
          <Text className='text-2xl font-bold mb-2'>{group?.name}</Text>
          <Text className='text-gray-600 mb-4'>{group?.description}</Text>
          
          {/* Group Stats */}
          <View className="flex-row space-x-4 mb-4">
            <View className="bg-muted px-3 py-2 rounded-lg">
              <Text className="text-sm text-muted-foreground">Members</Text>
              <Text className="text-lg font-semibold">{group?.members?.length || 0}</Text>
            </View>
            <View className="bg-muted px-3 py-2 rounded-lg">
              <Text className="text-sm text-muted-foreground">Meetups</Text>
              <Text className="text-lg font-semibold">{group?.meetups?.length || 0}</Text>
            </View>
          </View>

          {/* Subjects */}
          {group?.subjects && group.subjects.length > 0 && (
            <View className="mb-4">
              <Text className="text-sm font-medium mb-2">Subjects</Text>
              <View className="flex-row flex-wrap gap-2">
                {group.subjects.map((subject) => (
                  <View key={subject} className="bg-primary/10 border border-primary/20 rounded-full px-3 py-1">
                    <Text className="text-primary text-sm font-medium">{subject}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Group Creator/Owner */}
        {creator && (
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <Text className='text-lg font-semibold'>Group Owner</Text>
              <View className="ml-2 bg-amber-500 px-2 py-1 rounded-full">
                <Text className="text-xs font-bold text-white">OWNER</Text>
              </View>
            </View>
            <View className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-lg p-4 shadow-sm">
              <View className="flex-row items-center space-x-3">
                <View className="relative">
                  <Avatar className="w-12 h-12" alt={`${creator.firstName} ${creator.lastName}`}>
                    <AvatarImage source={{ uri: creator.avatar }} />
                    <AvatarFallback className="bg-amber-500">
                      <Text className="text-white font-semibold">
                        {getMemberInitials(creator)}
                      </Text>
                    </AvatarFallback>
                  </Avatar>
                  {/* Crown icon indicator */}
                  <View className="absolute -top-1 -right-1 bg-amber-500 rounded-full w-5 h-5 items-center justify-center">
                    <Text className="text-white text-xs">👑</Text>
                  </View>
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center space-x-2">
                    <Text className="font-bold text-lg text-amber-800">
                      {creator.firstName} {creator.lastName}
                    </Text>
                  </View>
                  <Text className="text-amber-700 font-medium">
                    {creator.school} • Class of {creator.graduationYear}
                  </Text>
                  {creator.majors && (
                    <Text className="text-sm text-amber-600">
                      {creator.majors}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Other Members */}
        {otherMembers.length > 0 && (
          <View className="mb-6">
            <Text className='text-lg font-semibold mb-3'>
              Members ({otherMembers.length})
            </Text>
            <View className="space-y-2">
              {otherMembers.map((member) => (
                <View key={member.id} className="bg-card border border-border rounded-lg p-3">
                  <View className="flex-row items-center space-x-3">
                    <Avatar className="w-10 h-10" alt={`${member.firstName} ${member.lastName}`}>
                      <AvatarImage source={{ uri: member.avatar }} />
                      <AvatarFallback className="bg-secondary">
                        <Text className="text-secondary-foreground font-semibold">
                          {getMemberInitials(member)}
                        </Text>
                      </AvatarFallback>
                    </Avatar>
                    <View className="flex-1">
                      <Text className="font-medium">
                        {member.firstName} {member.lastName}
                      </Text>
                      <Text className="text-sm text-muted-foreground">
                        {member.school} • Class of {member.graduationYear}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View className='flex-row space-x-2 mb-6'>
          <Button onPress={() => router.back()} className="flex-1">
            <Text>Back</Text>
          </Button>
          <Button onPress={() => setShowMeetupModal(true)} className="flex-1">
            <Text>Schedule Meetup</Text>
          </Button>
        </View>

        {/* Delete Group Button (only for creator) */}
        {authUser && group?.createdBy === authUser.uid && (
          <View className="mb-6">
            <Button 
              onPress={handleDeleteGroup} 
              disabled={isDeleting}
              className="bg-destructive"
            >
              <Text className="text-destructive-foreground">
                {isDeleting ? 'Deleting...' : 'Delete Group'}
              </Text>
            </Button>
          </View>
        )}

        {/* Meetups Section */}
        <View className="mb-6">
          <Text className='text-lg font-semibold mb-3'>Meetups</Text>
          {group?.meetups && group.meetups.length > 0 ? (
            <View className="space-y-3">
              {group.meetups.map((meetup) => (
                <MeetupCard 
                  key={meetup.id}
                  meetup={meetup} 
                  onPress={handleMeetupPress}
                  onJoin={handleJoinMeetup}
                  isJoining={isJoiningMeetup}
                  currentUserId={authUser?.uid}
                />
              ))}
            </View>
          ) : (
            <View className="bg-muted rounded-lg p-6">
              <Text className='text-muted-foreground text-center'>
                No meetups scheduled yet
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <CreateMeetupModal
        visible={showMeetupModal}
        onClose={() => setShowMeetupModal(false)}
        onCreate={handleCreateMeetup}
        isLoading={isCreatingMeetup}
      />
    </Page>
  )
}

export default GroupHome