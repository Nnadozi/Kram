import CustomButton from '@/components/CustomButton'
import CustomText from '@/components/CustomText'
import { db } from '@/firebaseConfig'
import { useAsyncOperation } from '@/hooks/useAsyncOperation'
import { useUserStore } from '@/stores/userStore'
import { Group } from '@/types/Group'
import { router } from 'expo-router'
import { arrayUnion, doc, updateDoc } from 'firebase/firestore'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { Icon, useTheme } from 'react-native-paper'

interface GroupPreviewProps {
  group: Group
}

const GroupPreview = ({ group }: GroupPreviewProps) => {
  const { colors } = useTheme()
  const { userProfile, setUserProfile } = useUserStore()
  const isAlreadyMember = userProfile?.groups?.includes(group.id) || false

  const { execute: joinGroup, isLoading } = useAsyncOperation({
    onSuccess: () => {
      setUserProfile({
        groups: [...(userProfile?.groups || []), group.id]
      })
    },
    showErrorAlert: true
  })

  const handleJoinGroup = () => {
    if (!userProfile) return

    joinGroup(async () => {
      await updateDoc(doc(db, 'users', userProfile.uid), {
        groups: arrayUnion(group.id)
      })
      await updateDoc(doc(db, 'groups', group.id), {
        members: arrayUnion(userProfile.uid)
      })
    })
  }

  const formatDate = (date: any) => date?.toDate?.()?.toLocaleDateString() || 'Unknown'

  return (
    <TouchableOpacity
      onPress={() => router.push({ pathname: '/(main)/GroupDetail', params: { groupId: group.id }})}
      activeOpacity={0.75}
      style={[styles.container, { shadowColor: colors.shadow, backgroundColor: colors.surface }]}
    >
      <View style={styles.header}>
        <CustomText bold fontSize="lg" primary>
          {group.name} {isAlreadyMember && <CustomText fontSize="sm" gray>(Member)</CustomText>}
        </CustomText>
      </View>

      <CustomText fontSize="sm" gray numberOfLines={2}>
        {group.description}
      </CustomText>

      <View style={styles.infoRow}>
        <Icon source="calendar-plus" size={16} color="gray" />
        <CustomText fontSize="sm" gray>Created: {formatDate(group.createdAt)}</CustomText>
      </View>

      <View style={styles.infoRow}>
        <Icon source="account-group" size={16} color="gray" />
        <CustomText fontSize="sm" gray>{group.members?.length || 0} members</CustomText>
      </View>

      {group.subjects?.length > 0 && (
        <View style={styles.subjectsContainer}>
          {group.subjects.slice(0, 3).map((subject, index) => (
            <CustomText primary fontSize="sm" gray key={index}>{subject}</CustomText>
          ))}
          {group.subjects.length > 3 && (
            <CustomText fontSize="sm" gray>+{group.subjects.length - 3} more</CustomText>
          )}
        </View>
      )}

      {!isAlreadyMember && (
        <CustomButton
          variant="outlined"
          onPress={handleJoinGroup}
          disabled={isLoading}
          style={{marginTop: 8}}
        >
          {isLoading ? 'Joining...' : 'Join Group'}
        </CustomButton>
      )}
    </TouchableOpacity>
  )
}

export default GroupPreview

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  subjectsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
})