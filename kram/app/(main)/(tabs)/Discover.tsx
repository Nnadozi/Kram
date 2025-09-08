import { StyleSheet, View, FlatList, TouchableOpacity, ScrollView } from 'react-native'
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
import { useAsyncOperation } from '@/hooks/useAsyncOperation'
import { cache, CACHE_KEYS } from '@/lib/cache'
import { Skeleton } from '@/components/ui/skeleton'
import { SUBJECTS } from '@/constants/subjects'

const Discover = () => {
  const [search, setSearch] = useState('')
  const [allGroups, setAllGroups] = useState<Group[]>([])
  const [filteredGroups, setFilteredGroups] = useState<Group[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [memberCountFilter, setMemberCountFilter] = useState<'all' | 'small' | 'medium' | 'large'>('all')
  const { userProfile } = useUserStore()
  
  // Using the useAsyncOperation hook
  const { execute: fetchGroups, isLoading } = useAsyncOperation({
    errorMessage: 'Failed to load groups. Please try again.',
    onSuccess: (groups) => {
      setAllGroups(groups)
      setFilteredGroups(groups)
    }
  })

  // Helper functions for filtering
  const toggleSubject = (subject: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subject) 
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    )
  }

  const getMemberCountRange = (count: number): 'small' | 'medium' | 'large' => {
    if (count <= 5) return 'small'
    if (count <= 15) return 'medium'
    return 'large'
  }

  const clearFilters = () => {
    setSelectedSubjects([])
    setMemberCountFilter('all')
  }

  const hasActiveFilters = selectedSubjects.length > 0 || memberCountFilter !== 'all'

  // Single function to fetch groups with caching
  const loadGroups = React.useCallback(async () => {
    // Check cache first
    const cachedGroups = cache.get<Group[]>(CACHE_KEYS.GROUPS)
    if (cachedGroups) {
      return cachedGroups
    }

    // Fetch from Firebase
    const groupsRef = collection(db, 'groups')
    const q = query(groupsRef)
    const querySnapshot = await getDocs(q)    
    const groups: Group[] = []
    querySnapshot.forEach((doc) => {
      groups.push(doc.data() as Group)
    })   
    
    // Cache the results for 2 minutes
    cache.set(CACHE_KEYS.GROUPS, groups, 2 * 60 * 1000)
    
    return groups
  }, [])

  // Fetch groups when screen mounts
  useEffect(() => {
    fetchGroups(loadGroups)
  }, [loadGroups])

  // Refresh groups when screen comes into focus (e.g., returning from create group)
  useFocusEffect(
    React.useCallback(() => {
      // Clear cache to ensure fresh data when returning from create group
      cache.delete(CACHE_KEYS.GROUPS)
      fetchGroups(loadGroups)
    }, [loadGroups])
  )

  useEffect(() => {
    let filtered = allGroups

    // Apply search filter
    if (search.trim() !== '') {
      filtered = filtered.filter(group =>
        group.name.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Apply subject filter
    if (selectedSubjects.length > 0) {
      filtered = filtered.filter(group =>
        selectedSubjects.some(subject => 
          group.subjects?.includes(subject)
        )
      )
    }

    // Apply member count filter
    if (memberCountFilter !== 'all') {
      filtered = filtered.filter(group => {
        const memberCount = group.members?.length || 0
        const groupSize = getMemberCountRange(memberCount)
        return groupSize === memberCountFilter
      })
    }

    setFilteredGroups(filtered)
  }, [search, allGroups, selectedSubjects, memberCountFilter])

  return (
    <Page>
      <View className="flex-row items-center justify-between mb-4">
        <Text variant={'h3'}>Discover</Text>
        <Button onPress={() => router.push('/(main)/CreateGroup')}>
          <Text>Create Group</Text>
        </Button>
      </View>
      
      <Input
        placeholder='Search groups...'
        value={search}
        onChangeText={setSearch}
        maxLength={50}
        showCounter={false}
        className="mb-4"
      />

      {/* Filter Toggle Button */}
      <View className="flex-row items-center justify-between mb-4">
        <TouchableOpacity
          onPress={() => setShowFilters(!showFilters)}
          className="flex-row items-center space-x-2"
        >
          <Text className="text-lg font-medium">Filters</Text>
          {hasActiveFilters && (
            <View className="bg-primary rounded-full w-2 h-2" />
          )}
        </TouchableOpacity>
        {hasActiveFilters && (
          <TouchableOpacity onPress={clearFilters}>
            <Text className="text-primary">Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Panel */}
      {showFilters && (
        <View className="bg-muted rounded-lg p-4 mb-4">
          {/* Subject Filter */}
          <View className="mb-4">
            <Text className="text-sm font-medium mb-2">Subjects</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
              {SUBJECTS.map((subject) => (
                <TouchableOpacity
                  key={subject}
                  onPress={() => toggleSubject(subject)}
                  className={`px-3 py-2 rounded-full border mr-2 ${
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
            </ScrollView>
          </View>

          {/* Member Count Filter */}
          <View>
            <Text className="text-sm font-medium mb-2">Group Size</Text>
            <View className="flex-row space-x-2">
              {[
                { key: 'all', label: 'All Sizes' },
                { key: 'small', label: 'Small (1-5)' },
                { key: 'medium', label: 'Medium (6-15)' },
                { key: 'large', label: 'Large (16+)' }
              ].map(({ key, label }) => (
                <TouchableOpacity
                  key={key}
                  onPress={() => setMemberCountFilter(key as any)}
                  className={`px-3 py-2 rounded-lg border ${
                    memberCountFilter === key
                      ? 'bg-primary border-primary'
                      : 'bg-background border-border'
                  }`}
                >
                  <Text className={`text-sm ${
                    memberCountFilter === key
                      ? 'text-primary-foreground'
                      : 'text-foreground'
                  }`}>
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}
      
      {isLoading ? (
        <View className="space-y-3">
          {[...Array(3)].map((_, index) => (
            <View key={index} className="p-4 border border-border rounded-lg">
              <Skeleton height={20} width="60%" className="mb-2" />
              <Skeleton height={16} width="40%" />
            </View>
          ))}
        </View>
      ) : (
        <View className='w-full space-y-2'>
          {filteredGroups.length > 0 ? (
            <FlatList
              data={filteredGroups}
              keyExtractor={(item) => item.id}
              renderItem={({ item }: { item: Group }) => (
                <GroupPreviewCard 
                  group={item} 
                  isJoined={userProfile?.groups?.some((group) => group.id === item.id) || false} 
                />
              )}
              removeClippedSubviews={true}
              maxToRenderPerBatch={10}
              windowSize={10}
              initialNumToRender={5}
              getItemLayout={(data, index) => ({
                length: 120, // Approximate height of GroupPreviewCard
                offset: 120 * index,
                index,
              })}
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