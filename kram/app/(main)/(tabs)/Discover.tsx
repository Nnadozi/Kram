import { StyleSheet, View, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Page } from '@/components/page'
import { Text } from '@/components/ui/text'
import { Button } from '@/components/ui/button'
import { router, useFocusEffect } from 'expo-router'
import { Input } from '@/components/ui/input'
import { Group } from '@/types/Group'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
import { db } from '@/firebase/firebaseConfig'
import GroupPreviewCard from '@/components/GroupPreviewCard'
import { useUserStore } from '@/stores/userStore'

const Discover = () => {
  const [search, setSearch] = useState('')
  const [allGroups, setAllGroups] = useState<Group[]>([])
  const [filteredGroups, setFilteredGroups] = useState<Group[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { userProfile } = useUserStore()

  // Fetch groups when screen mounts
  useEffect(() => {
    fetchAllGroups()
  }, [])

  // Refresh groups when screen comes into focus (e.g., returning from create group)
  useFocusEffect(
    React.useCallback(() => {
      fetchAllGroups()
    }, [])
  )

  useEffect(() => {
    if (search.trim() === '') {
      setFilteredGroups(allGroups)
    } else {
      const filtered = allGroups.filter(group =>
        group.name.toLowerCase().includes(search.toLowerCase())
      )
      setFilteredGroups(filtered)
    }
  }, [search, allGroups])

  const fetchAllGroups = async () => {
    try {
      setIsLoading(true)
      const groupsRef = collection(db, 'groups')
      const q = query(groupsRef)
      const querySnapshot = await getDocs(q)
      
      const groups: Group[] = []
      querySnapshot.forEach((doc) => {
        groups.push(doc.data() as Group)
      })
      
      setAllGroups(groups)
      setFilteredGroups(groups)
    } catch (error) {
      console.error('Error fetching groups:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGroupPress = (groupId: string) => {
    router.push({
      pathname: '/(main)/GroupHome',
      params: { groupId }
    })
  }

  return (
    <Page>
      <Text variant={'large'}>Discover</Text>
      <Button onPress={() => router.push('/(main)/CreateGroup')}>
        <Text>Create Group</Text>
      </Button>
      
      <Input
        placeholder='Search groups...'
        value={search}
        onChangeText={setSearch}
      />
      
      {isLoading ? (
        <Text>Loading groups...</Text>
      ) : (
        <View className='w-full space-y-2'>
          {filteredGroups.length > 0 ? (
            <FlatList
              data={filteredGroups}
              renderItem={({ item }: { item: Group }) => (
                <GroupPreviewCard group={item} key={item.id} isJoined={userProfile?.groups?.some((group) => group.id === item.id) || false} />
              )}
            />
          ) : (
            <Text className='text-center text-gray-500 mt-4'>
              {search ? 'No groups found matching your search' : 'No groups available'}
            </Text>
          )}
        </View>
      )}
    </Page>
  )
}

export default Discover