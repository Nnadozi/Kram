import CustomButton from '@/components/CustomButton'
import CustomText from '@/components/CustomText'
import Page from '@/components/Page'
import { db } from '@/firebase/firebaseConfig'
import { useAsyncOperation } from '@/hooks/useAsyncOperation'
import { meetupService } from '@/services/meetupService'
import { Meetup } from '@/types/Meetup'
import { UserProfile } from '@/types/UserProfile'
import { formatDuration, formatMeetupDate, formatMeetupTime } from '@/util/dateUtils'
import { deleteDoc, doc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { Alert, Modal, StyleSheet, TouchableOpacity, View } from 'react-native'
import { useTheme } from 'react-native-paper'

interface MeetupDetailModalProps {
  meetup: Meetup
  visible: boolean
  onClose: () => void
  onDelete?: (meetupId: string) => void
  isCreator: boolean
}

const MeetupDetailModal = ({ 
  meetup, 
  visible, 
  onClose, 
  onDelete, 
  isCreator 
}: MeetupDetailModalProps) => {
  const [attendeeProfiles, setAttendeeProfiles] = useState<UserProfile[]>([])
  const [loadingAttendees, setLoadingAttendees] = useState(false)
  const { colors } = useTheme()

  // Load attendee profiles when modal opens
  const loadAttendeeProfiles = async () => {
    if (!meetup.attendees || meetup.attendees.length === 0) {
      setAttendeeProfiles([])
      return
    }

    setLoadingAttendees(true)
    try {
      const profiles = await meetupService.getMeetupAttendees(meetup.attendees)
      setAttendeeProfiles(profiles)
    } catch (error) {
      console.error('Error loading attendee profiles:', error)
      Alert.alert('Error', 'Failed to load attendee information')
      setAttendeeProfiles([])
    } finally {
      setLoadingAttendees(false)
    }
  }

  // Load attendees when modal becomes visible
  useEffect(() => {
    if (visible) {
      loadAttendeeProfiles()
    }
  }, [visible])

  // Delete meetup with confirmation
  const { execute: deleteMeetup, isLoading: isDeleting } = useAsyncOperation({
    onSuccess: () => {
      Alert.alert('Success', 'Meetup deleted successfully!')
      onClose()
      onDelete?.(meetup.id)
    },
    showErrorAlert: true,
    errorMessage: 'Failed to delete meetup. Please try again.'
  })

  const handleDeleteMeetup = () => {
    Alert.alert(
      'Delete Meetup',
      `Are you sure you want to delete "${meetup.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteMeetup(async () => {
              await deleteDoc(doc(db, 'meetups', meetup.id))
            })
          }
        }
      ]
    )
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <Page style={{ justifyContent: 'flex-start', alignItems: 'flex-start' }}>
        <View style={styles.modalHeader}>
          <CustomText style={{ flex: 1 }} bold fontSize="xl" numberOfLines={2}>
            {meetup.name}
          </CustomText>
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeButton}
          >
            <CustomText fontSize="lg">✕</CustomText>
          </TouchableOpacity>
        </View>

        <View style={styles.detailContent}>
          {/* Basic Info */}
          <View style={styles.detailSection}>
            <CustomText bold fontSize="lg" style={styles.sectionTitle}>Details</CustomText>
            
            <View style={styles.detailRow}>
              <CustomText fontSize="sm" gray>Date:</CustomText>
              <CustomText fontSize="sm">{formatMeetupDate(meetup.date)}</CustomText>
            </View>
            
            <View style={styles.detailRow}>
              <CustomText fontSize="sm" gray>Time:</CustomText>
              <CustomText fontSize="sm">{formatMeetupTime(meetup.time)}</CustomText>
            </View>
            
            <View style={styles.detailRow}>
              <CustomText fontSize="sm" gray>Duration:</CustomText>
              <CustomText fontSize="sm">{formatDuration(meetup.length)}</CustomText>
            </View>
            
            <View style={styles.detailRow}>
              <CustomText fontSize="sm" gray>Type:</CustomText>
              <CustomText fontSize="sm">
                {meetup.type === 'virtual' ? 'Virtual' : 'In-Person'}
              </CustomText>
            </View>
            
            <View style={styles.detailRow}>
              <CustomText fontSize="sm" gray>
                {meetup.type === 'virtual' ? 'Link:' : 'Location:'}
              </CustomText>
              <CustomText fontSize="sm" numberOfLines={2} style={styles.locationDetail}>
                {meetup.location}
              </CustomText>
            </View>
          </View>

          {/* Description */}
          <View style={styles.detailSection}>
            <CustomText bold fontSize="lg" style={styles.sectionTitle}>Description</CustomText>
            <CustomText fontSize="sm" style={styles.description}>
              {meetup.description}
            </CustomText>
          </View>

          {/* Attendees */}
          <View style={styles.detailSection}>
            <CustomText bold fontSize="lg" style={styles.sectionTitle}>
              Attendees ({meetup.attendees?.length || 0})
            </CustomText>
            
            {loadingAttendees ? (
              <CustomText fontSize="sm" gray>Loading attendees...</CustomText>
            ) : attendeeProfiles.length > 0 ? (
              <View style={styles.attendeesList}>
                {attendeeProfiles.map((profile) => (
                  <View key={profile.uid} style={styles.attendeeItem}>
                    <CustomText fontSize="sm">
                      {profile.firstName} {profile.lastName}
                    </CustomText>
                    {profile.uid === meetup.createdBy && (
                      <CustomText fontSize="xs" style={{ color: colors.primary }}>
                        Creator
                      </CustomText>
                    )}
                  </View>
                ))}
              </View>
            ) : (
              <CustomText fontSize="sm" gray>No attendees yet</CustomText>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            {isCreator && (
              <CustomButton
                variant="outlined"
                onPress={handleDeleteMeetup}
                disabled={isDeleting}
                style={[styles.deleteButton, { borderColor: 'red' }]}
              >
                <CustomText style={{ color: 'red' }}>
                  {isDeleting ? 'Deleting...' : 'Delete Meetup'}
                </CustomText>
              </CustomButton>
            )}
            
            <CustomButton
              variant="outlined"
              onPress={onClose}
              style={styles.closeModalButton}
            >
              Close
            </CustomButton>
          </View>
        </View>
      </Page>
    </Modal>
  )
}

export default MeetupDetailModal

const styles = StyleSheet.create({
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingRight: 8,
  },
  closeButton: {
    padding: 8,
    marginLeft: 8,
  },
  detailContent: {
    width: '100%',
    gap: 20,
  },
  detailSection: {
    gap: 12,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 4,
  },
  locationDetail: {
    flex: 1,
    textAlign: 'right',
    marginLeft: 12,
  },
  description: {
    lineHeight: 20,
  },
  attendeesList: {
    gap: 8,
  },
  attendeeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
  },
  actionButtons: {
    gap: 12,
    marginTop: 20,
  },
  deleteButton: {
    borderWidth: 1,
  },
  closeModalButton: {
    marginTop: 8,
  },
})

// DONE!
