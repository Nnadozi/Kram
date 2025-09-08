import { StyleSheet, Alert, View, ScrollView, TouchableOpacity } from 'react-native'
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
import { validateInput, ValidationPresets } from '@/lib/utils'
import { useAsyncOperation } from '@/hooks/useAsyncOperation'
import { SUBJECTS } from '@/constants/subjects'
import uuid from 'react-native-uuid';

const CreateGroup = () => {
  const [groupName, setGroupName] = useState('')
  const [groupDescription, setGroupDescription] = useState('')
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const { userProfile, setUserProfile, authUser } = useUserStore()
  
  const { execute: createGroup, isLoading } = useAsyncOperation({
    errorMessage: 'Failed to create group. Please try again.',
    onSuccess: (groupId) => {
      router.replace({
        pathname: '/(main)/GroupHome',
        params: { groupId: groupId }
      })
    }
  })

  // Helper functions for subject management
  const toggleSubject = (subject: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subject) 
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    )
  }


  const removeSubject = (subject: string) => {
    setSelectedSubjects(prev => prev.filter(s => s !== subject))
  }

  const handleCreateGroup = () => {
    // Validate group name
    const nameValidation = validateInput(groupName, ValidationPresets.groupName)
    if (!nameValidation.isValid) {
      Alert.alert('Error', nameValidation.error)
      return
    }

    // Validate group description (optional)
    const descriptionValidation = validateInput(groupDescription, ValidationPresets.description)
    if (!descriptionValidation.isValid) {
      Alert.alert('Error', descriptionValidation.error)
      return
    }

    if (!authUser) {
      Alert.alert('Error', 'You must be logged in to create a group')
      return
    }

    createGroup(async () => {
      const groupId = uuid.v4() 
      const group = {
        id: groupId,
        name: groupName.trim(),
        description: groupDescription.trim(),
        subjects: selectedSubjects,
        createdBy: authUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        members: [userProfile],
        meetups: [],
      }
      await setDoc(doc(db, 'groups', groupId), { ...group})
      setUserProfile({
        groups: [...userProfile?.groups || [], {
          ...group,
          createdAt: new Date(),
          updatedAt: new Date()
        }] as Group[] 
      })
      
      return groupId
    })
  }

  return (
    <Page>
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="mb-6">
          <Text className="text-2xl font-bold mb-2">Create New Group</Text>
          <Text className="text-muted-foreground">
            Set up a study group with your peers
          </Text>
        </View>

        {/* Group Name Input */}
        <View className="mb-4">
          <Text className="text-sm font-medium mb-2">Group Name *</Text>
          <Input 
            placeholder='Enter group name' 
            value={groupName} 
            onChangeText={setGroupName} 
            maxLength={100}
          />
        </View>

        {/* Group Description Input */}
        <View className="mb-4">
          <Text className="text-sm font-medium mb-2">Description</Text>
          <Input 
            placeholder='Describe what this group is about' 
            value={groupDescription} 
            onChangeText={setGroupDescription} 
            maxLength={500}
            multiline
            numberOfLines={3}
            inputHeight={80}
          />
        </View>

        {/* Subjects Selection */}
        <View className="mb-4">
          <Text className="text-sm font-medium mb-2">Subjects *</Text>
          <Text className="text-xs text-muted-foreground mb-3">
            Select relevant subjects for your group
          </Text>
          
          {/* Selected Subjects Display */}
          {selectedSubjects.length > 0 && (
            <View className="mb-3">
              <Text className="text-xs text-muted-foreground mb-2">Selected subjects:</Text>
              <View className="flex-row flex-wrap gap-2">
                {selectedSubjects.map((subject) => (
                  <View key={subject} className="bg-primary rounded-full px-3 py-1 flex-row items-center">
                    <Text className="text-primary-foreground text-sm mr-2">{subject}</Text>
                    <TouchableOpacity onPress={() => removeSubject(subject)}>
                      <Text className="text-primary-foreground text-sm font-bold">×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Predefined Subjects Grid */}
          <View className="mb-4">
            <Text className="text-xs text-muted-foreground mb-2">Choose from common subjects:</Text>
            <View className="flex-row flex-wrap gap-2">
              {SUBJECTS.map((subject) => (
                <TouchableOpacity
                  key={subject}
                  onPress={() => toggleSubject(subject)}
                  className={`px-3 py-2 rounded-full border ${
                    selectedSubjects.includes(subject)
                      ? 'bg-primary border-primary'
                      : 'bg-background border-border'
                  }`}
                >
                  <Text className={`text-sm ${
                    selectedSubjects.includes(subject)
                      ? 'text-primary-foreground'
                      : 'text-foreground'
                  }`}>
                    {subject}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

        </View>

        {/* Action Buttons */}
        <View className="flex-row space-x-2 mb-6">
          <Button onPress={() => router.back()} className="flex-1" variant="outline">
            <Text>Cancel</Text>
          </Button>
          <Button 
            onPress={handleCreateGroup} 
            disabled={isLoading || selectedSubjects.length === 0}
            className="flex-1"
          >
            <Text>{isLoading ? 'Creating...' : 'Create Group'}</Text>
          </Button>
        </View>
      </ScrollView>
    </Page>
  )
}

export default CreateGroup

const styles = StyleSheet.create({})