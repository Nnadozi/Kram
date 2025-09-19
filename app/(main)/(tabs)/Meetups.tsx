import CustomText from '@/components/CustomText'
import MeetupPreview from '@/components/MeetupPreview'
import Page from '@/components/Page'
import { useUserGroups } from '@/hooks/useUserGroups'
import { meetupService } from '@/services/meetupService'
import { useUserStore } from '@/stores/userStore'
import { Meetup } from '@/types/Meetup'
import { getMeetupStatus } from '@/util/dateUtils'
import { useEffect, useState } from 'react'
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native'
import { Chip, useTheme } from 'react-native-paper'

const Meetups = () => {
  const { userProfile } = useUserStore()
  const { colors } = useTheme()
  const [meetups, setMeetups] = useState<Meetup[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming')
  
  const { groups: userGroups } = useUserGroups()

  // Load user's meetups
  const loadMeetups = async () => {
    if (!userProfile?.uid) return
    
    setLoading(true)
    try {
      const userMeetups = await meetupService.getUserMeetups(userProfile.uid, userProfile.groups)
      setMeetups(userMeetups)
    } catch (error) {
      console.error('Error loading meetups:', error)
      setMeetups([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMeetups()
  }, [userProfile?.groups])

  // Filter meetups based on selected filter
  const getFilteredMeetups = () => {
    switch (filter) {
      case 'upcoming':
        return meetups.filter(meetup => getMeetupStatus(meetup) === 'upcoming')
      case 'past':
        return meetups.filter(meetup => getMeetupStatus(meetup) === 'past')
      default:
        return meetups
    }
  }

  const filteredMeetups = getFilteredMeetups()

  const handleRefresh = () => {
    loadMeetups()
  }

  const handleMeetupDelete = (meetupId: string) => {
    setMeetups(prev => prev.filter(m => m.id !== meetupId))
  }

  const getGroupName = (groupId: string) => {
    const group = userGroups.find(g => g.id === groupId)
    return group?.name || 'Unknown Group'
  }

  return (
    <Page style={styles.container}>
      <View style={styles.header}>
        <CustomText bold fontSize='2xl'>Meetups</CustomText>
        <CustomText fontSize='sm' gray>
          {filteredMeetups.length} {filter === 'all' ? 'total' : filter} meetup{filteredMeetups.length !== 1 ? 's' : ''}
        </CustomText>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        <Chip
          selected={filter === 'upcoming'}
          onPress={() => setFilter('upcoming')}
          style={[styles.filterChip, filter === 'upcoming' && { backgroundColor: colors.primaryContainer }]}
          textStyle={filter === 'upcoming' ? { color: colors.onPrimaryContainer } : undefined}
        >
          Upcoming
        </Chip>
        <Chip
          selected={filter === 'all'}
          onPress={() => setFilter('all')}
          style={[styles.filterChip, filter === 'all' && { backgroundColor: colors.primaryContainer }]}
          textStyle={filter === 'all' ? { color: colors.onPrimaryContainer } : undefined}
        >
          All
        </Chip>
        <Chip
          selected={filter === 'past'}
          onPress={() => setFilter('past')}
          style={[styles.filterChip, filter === 'past' && { backgroundColor: colors.primaryContainer }]}
          textStyle={filter === 'past' ? { color: colors.onPrimaryContainer } : undefined}
        >
          Past
        </Chip>
      </View>

      {/* Meetups List */}
      {!userProfile?.groups || userProfile.groups.length === 0 ? (
        <View style={styles.emptyState}>
          <CustomText fontSize='lg' gray textAlign='center'>
            Join some groups to see meetups!
          </CustomText>
        </View>
      ) : (
        <FlatList
          data={filteredMeetups}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
            />
          }
          contentContainerStyle={styles.listContainer}
          renderItem={({ item: meetup }) => (
            <View style={styles.meetupContainer}>
              <View style={styles.groupLabel}>
                <CustomText fontSize='xs' style={{ color: colors.primary }}>
                  {getGroupName(meetup.groupId)}
                </CustomText>
              </View>
              <MeetupPreview
                meetup={meetup}
                onDelete={handleMeetupDelete}
              />
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <CustomText fontSize='lg' gray textAlign='center'>
                {loading ? 'Loading meetups...' : `No ${filter === 'all' ? '' : filter + ' '}meetups found`}
              </CustomText>
              {!loading && filter !== 'all' && (
                <CustomText fontSize='sm' gray textAlign='center' style={{ marginTop: 8 }}>
                  Try changing the filter above
                </CustomText>
              )}
            </View>
          }
        />
      )}
    </Page> 
  )
}

export default Meetups

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
  },
  header: {
    width: '100%',
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    width: '100%',
  },
  filterChip: {
    marginRight: 4,
  },
  listContainer: {
    width: '100%',
    paddingBottom: 20,
  },
  meetupContainer: {
    width: '100%',
    marginBottom: 4,
  },
  groupLabel: {
    marginBottom: 4,
    marginLeft: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    width: '100%',
  },
})