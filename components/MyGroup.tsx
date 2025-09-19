import { db } from '@/firebase/firebaseConfig'
import { useAsyncOperation } from '@/hooks/useAsyncOperation'
import { Group } from '@/types/Group'
import { Meetup } from '@/types/Meetup'
import { UserProfile } from '@/types/UserProfile'
import { router } from 'expo-router'
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Icon, useTheme } from 'react-native-paper'
import CustomText from './CustomText'

interface MyGroupProps {
  groupId: string
}

const MyGroup = ({ groupId }: MyGroupProps) => {
  const { colors } = useTheme()
  const [group, setGroup] = useState<Group | null>(null)
  const [members, setMembers] = useState<UserProfile[]>([])
  const [meetups, setMeetups] = useState<Meetup[]>([])

  const { execute: fetchGroup, isLoading } = useAsyncOperation({
    onSuccess: (result: Group) => {
      setGroup(result)
    },
    showErrorAlert: false
  })

  const { execute: fetchMembers, isLoading: membersLoading } = useAsyncOperation({
    onSuccess: (result: UserProfile[]) => {
      setMembers(result)
    },
    showErrorAlert: false
  })

  const { execute: fetchMeetups, isLoading: meetupsLoading } = useAsyncOperation({
    onSuccess: (result: Meetup[]) => {
      setMeetups(result)
    },
    showErrorAlert: false
  })

  useEffect(() => {
    if (groupId) {
      fetchGroup(async () => {
        const groupDoc = await getDoc(doc(db, 'groups', groupId))
        if (groupDoc.exists()) {
          return { id: groupDoc.id, ...groupDoc.data() } as Group
        }
        throw new Error('Group not found')
      })
    }
  }, [groupId])

  useEffect(() => {
    if (group?.members && group.members.length > 0) {
      fetchMembers(async () => {
        const memberPromises = group.members.map(memberId =>
          getDoc(doc(db, 'users', memberId))
        )
        const memberDocs = await Promise.all(memberPromises)
        return memberDocs
          .filter(doc => doc.exists())
          .map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile))
      })
    }
  }, [group?.members])

  useEffect(() => {
    if (group?.meetups && group.meetups.length > 0) {
      fetchMeetups(async () => {
        const meetupPromises = group.meetups.map(meetupId =>
          getDoc(doc(db, 'meetups', meetupId))
        )
        const meetupDocs = await Promise.all(meetupPromises)
        return meetupDocs
          .filter(doc => doc.exists())
          .map(doc => ({ id: doc.id, ...doc.data() } as Meetup))
      })
    }
  }, [group?.meetups])

  if (isLoading || membersLoading || meetupsLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="small" color={colors.primary} />
        <CustomText gray fontSize="sm">Loading group...</CustomText>
      </View>
    )
  }
  
  if (!group || !group.name) {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface }]}>
        <CustomText gray>Group not found</CustomText>
      </View>
    )
  }
  
  return (
    <TouchableOpacity onPress={() => router.push({
        pathname: '/(main)/GroupDetail',
        params: {
            groupId: group.id
        }
    })} activeOpacity={0.75} style={[styles.container,{shadowColor: colors.shadow, backgroundColor: colors.surface}]}>
      
      {/* Header with group name and notification badge */}
      <View style={styles.header}>
        <CustomText bold fontSize="lg" primary style={styles.groupName}>
          {group.name}
        </CustomText>
        <View style={[styles.badge, {backgroundColor: colors.primary}]}>
          <Icon source="bell" size={15} color={colors.onPrimary} />
          <CustomText fontSize="sm" bold opposite>3</CustomText>
        </View>
      </View>
      
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
        <Icon source="calendar" color={"gray"} size={16} />
        <CustomText gray bold fontSize="sm">Next Meetup: 
            <CustomText  fontSize="sm"> Saturday, 4:00 - 6:00 PM</CustomText>  
        </CustomText>  
      </View>
    </TouchableOpacity>
  )
}

export default MyGroup

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 15,
        borderRadius: 10,
        marginVertical: 5,
        elevation: 5,
       shadowOffset: {width: 0, height: 2},
       shadowOpacity: 0.25,
       shadowRadius: 3,
       gap: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    groupName: {
        flex: 1,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        padding: 5,
        borderRadius: 100,
        paddingHorizontal: 10,
    }
})