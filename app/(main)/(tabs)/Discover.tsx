import ActivityIndicator from '@/components/ActivityIndicator'
import CustomInput from '@/components/CustomInput'
import CustomText from '@/components/CustomText'
import FilterModal from '@/components/FilterModal'
import GroupCreationModal from '@/components/GroupCreationModal'
import GroupPreview from '@/components/GroupPreview'
import { OfflineModal } from '@/components/OfflineModal'
import Page from '@/components/Page'
import { db } from '@/firebaseConfig'
import { useAsyncOperation } from '@/hooks/useAsyncOperation'
import { useNetworkCheck } from '@/hooks/useNetworkCheck'
import { Group } from '@/types/Group'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native'
import { IconButton, useTheme } from 'react-native-paper'

const Discover = () => {
  const { colors } = useTheme()
  const { withNetworkCheck, showOfflineModal, closeOfflineModal, modalConfig } = useNetworkCheck()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [allGroups, setAllGroups] = useState<Group[]>([])
  const [filteredGroups, setFilteredGroups] = useState<Group[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Filter states
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'members'>('name')
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])

  const { execute: fetchGroups, isLoading } = useAsyncOperation({
    onSuccess: (groups: Group[]) => {
      setAllGroups(groups)
      setFilteredGroups(groups)
      setIsRefreshing(false)
    },
    onError: () => {
      setIsRefreshing(false)
    },
    showErrorAlert: true
  })

  const loadGroups = async (): Promise<void> => {
    await withNetworkCheck(
      async () => {
        return fetchGroups(async () => {
          const q = query(collection(db, 'groups'), orderBy('createdAt', 'desc'))
          const querySnapshot = await getDocs(q)
          return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Group))
        })
      },
      {
        offlineTitle: 'Cannot Load Groups',
        offlineMessage: 'You need an internet connection to discover groups. Please check your connection and try again.',
        onRetry: () => {
          loadGroups()
        }
      }
    )
  }

  useEffect(() => {
    loadGroups()
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await loadGroups()
  }

  useEffect(() => {
    let filtered = [...allGroups]

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(group =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.subjects?.some(subject => subject.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // No member count filtering needed - removed for simplicity

    // Filter by selected subjects
    if (selectedSubjects.length > 0) {
      filtered = filtered.filter(group =>
        group.subjects?.some(subject => selectedSubjects.includes(subject))
      )
    }

    // Sort groups
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'date':
          const dateA = a.createdAt instanceof Date ? a.createdAt : (a.createdAt as any)?.toDate?.() || new Date(0)
          const dateB = b.createdAt instanceof Date ? b.createdAt : (b.createdAt as any)?.toDate?.() || new Date(0)
          return dateB.getTime() - dateA.getTime()
        case 'members':
          return (b.members?.length || 0) - (a.members?.length || 0)
        default:
          return 0
      }
    })

    setFilteredGroups(filtered)
  }, [allGroups, searchQuery, selectedSubjects, sortBy])

  const getAllSubjects = () => {
    const subjects = new Set<string>()
    allGroups.forEach(group => {
      group.subjects?.forEach(subject => subjects.add(subject))
    })
    return Array.from(subjects).sort()
  }

  const clearFilters = () => {
    setSortBy('name')
    setSelectedSubjects([])
  }

  return (
    <Page style={{justifyContent: 'flex-start', alignItems: 'flex-start'}}> 
      <CustomText bold fontSize='2xl' style={{marginBottom: 10}}>Discover</CustomText>
      <View style={styles.searchRow}>
        <CustomInput
          placeholder="Search groups..."
          onChangeText={setSearchQuery}
          value={searchQuery}
        style={{width: "100%"}}
        />  
        <IconButton icon="filter" onPress={() => setShowFilters(true)} />
        <IconButton icon="plus" onPress={() => {
          withNetworkCheck(
            async () => {
              setShowCreateModal(true)
              return Promise.resolve()
            },
            {
              offlineTitle: 'Cannot Create Group',
              offlineMessage: 'You need an internet connection to create a new group.'
            }
          )
        }} />
      </View>
      <CustomText bold style={{marginBottom: 10}} fontSize="sm" gray>{filteredGroups.length} group(s) found</CustomText>

      {isLoading ? (
        <ActivityIndicator 
          size="large" 
          message="Loading groups..." 
          style={styles.loading}
        />
      ) : (
        <FlatList
          data={filteredGroups}
          renderItem={({ item }) => <GroupPreview group={item} />}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          style={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={<CustomText gray textAlign="center" style={styles.empty}>No groups found</CustomText>}
        />
      )}

      <FilterModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        sortBy={sortBy}
        setSortBy={setSortBy}
        selectedSubjects={selectedSubjects}
        setSelectedSubjects={setSelectedSubjects}
        onClearFilters={clearFilters}
      />

      <GroupCreationModal visible={showCreateModal} onClose={() => setShowCreateModal(false)} />
      
      <OfflineModal
        visible={showOfflineModal}
        onClose={closeOfflineModal}
        onRetry={modalConfig.onRetry}
        title={modalConfig.title}
        message={modalConfig.message}
      />
    </Page>
  )
}

export default Discover

const styles = StyleSheet.create({
  searchRow: { 
    flexDirection: 'row',  marginBottom: 15, 
    alignItems: 'center', width: '100%', gap: 10
  },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 15 },
  loading: { textAlign: 'center', marginTop: 50 },
  empty: { marginTop: 50 },
  list: { flex: 1, width: '100%' },
})