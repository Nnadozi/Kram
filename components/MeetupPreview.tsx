import CustomText from '@/components/CustomText'
import MeetupDetailModal from '@/components/MeetupDetailModal'
import { useModal } from '@/hooks/useModal'
import { useUserStore } from '@/stores/userStore'
import { Meetup } from '@/types/Meetup'
import { formatDuration, formatMeetupDate, formatMeetupTime } from '@/util/dateUtils'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { useTheme } from 'react-native-paper'

interface MeetupPreviewProps {
  meetup: Meetup
  onDelete?: (meetupId: string) => void
}

const MeetupPreview = ({ meetup, onDelete }: MeetupPreviewProps) => {
  const { userProfile } = useUserStore()
  const { colors } = useTheme()
  const modal = useModal()

  // Check if current user is the creator
  const isCreator = userProfile?.uid === meetup.createdBy

  return (
    <>
      <TouchableOpacity
        style={[styles.previewCard, { backgroundColor: colors.surface }]}
        onPress={modal.open}
        activeOpacity={0.7}
      >
        <View style={styles.previewHeader}>
          <CustomText bold fontSize="lg" numberOfLines={1}>
            {meetup.name}
          </CustomText>
          <View style={styles.typeChip}>
            <CustomText fontSize="xs" style={{ color: colors.primary }}>
              {meetup.type === 'virtual' ? 'Virtual' : 'In-Person'}
            </CustomText>
          </View>
        </View>

        <View style={styles.previewInfo}>
          <View style={styles.infoRow}>
            <CustomText fontSize="sm" gray>Date: {formatMeetupDate(meetup.date)}</CustomText>
            <CustomText fontSize="sm" gray>Time: {formatMeetupTime(meetup.time)}</CustomText>
          </View>
          
          <View style={styles.infoRow}>
            <CustomText fontSize="sm" gray numberOfLines={1} style={styles.locationText}>
              Location: {meetup.location}
            </CustomText>
            <CustomText fontSize="sm" gray>Duration: {formatDuration(meetup.length)}</CustomText>
          </View>

          <View style={styles.attendeesRow}>
            <CustomText fontSize="sm" gray>
              {meetup.attendees?.length || 0} attending
            </CustomText>
            {meetup.cancelled && (
              <View style={styles.cancelledChip}>
                <CustomText fontSize="xs" style={{ color: 'red' }}>
                  CANCELLED
                </CustomText>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>

      {/* Detail Modal */}
      <MeetupDetailModal
        meetup={meetup}
        visible={modal.visible}
        onClose={modal.close}
        onDelete={onDelete}
        isCreator={isCreator}
      />
    </>
  )
}

export default MeetupPreview

const styles = StyleSheet.create({
  previewCard: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  previewInfo: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationText: {
    flex: 1,
    marginRight: 12,
  },
  attendeesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cancelledChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255,0,0,0.1)',
  },
})
