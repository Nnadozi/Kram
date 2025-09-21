import LoadingButton from '@/components/LoadingButton'
import CustomButton from '@/components/CustomButton'
import CustomInput from '@/components/CustomInput'
import CustomText from '@/components/CustomText'
import Page from '@/components/Page'
import { db } from '@/firebase/firebaseConfig'
import { useAsyncOperation } from '@/hooks/useAsyncOperation'
import { createValidationConfig, useFormValidation } from '@/hooks/useFormValidation'
import { useModal } from '@/hooks/useModal'
import { useUserStore } from '@/stores/userStore'
import { Group } from '@/types/Group'
import { Meetup } from '@/types/Meetup'
import { validationRules } from '@/util/validation'
import DateTimePicker from '@react-native-community/datetimepicker'
import { collection, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { useState } from 'react'
import { Alert, Modal, Platform, StyleSheet, View } from 'react-native'
import { Chip, useTheme } from 'react-native-paper'

interface MeetupCreationModalProps {
  visible: boolean
  onClose: () => void
  group: Group
  onMeetupCreated: (meetup: Meetup) => void
}

const MeetupCreationModal = ({ visible, onClose, group, onMeetupCreated }: MeetupCreationModalProps) => {
  const [meetupName, setMeetupName] = useState('')
  const [meetupDescription, setMeetupDescription] = useState('')
  const [meetupType, setMeetupType] = useState<'virtual' | 'in-person'>('virtual')
  const [location, setLocation] = useState('')
  const [date, setDate] = useState(new Date())
  const [startTime, setStartTime] = useState(new Date())
  const [endTime, setEndTime] = useState(() => {
    const defaultEnd = new Date()
    defaultEnd.setHours(defaultEnd.getHours() + 1) // Default 1 hour duration
    return defaultEnd
  })
  const datePickerModal = useModal()
  const startTimePickerModal = useModal()
  const endTimePickerModal = useModal()

  // Calculate duration automatically
  const calculateDuration = () => {
    const startDateTime = new Date(date)
    startDateTime.setHours(startTime.getHours(), startTime.getMinutes())
    
    const endDateTime = new Date(date)
    endDateTime.setHours(endTime.getHours(), endTime.getMinutes())
    
    const diffMs = endDateTime.getTime() - startDateTime.getTime()
    const diffMinutes = Math.max(0, Math.floor(diffMs / (1000 * 60)))
    
    return diffMinutes
  }
  
  const { userProfile } = useUserStore()
  const { colors } = useTheme()

  const validationConfig = createValidationConfig.custom({
    meetupName: {
      rule: validationRules.meetupName,
      errorMessage: 'Meetup name must be 3-100 characters'
    },
    meetupDescription: {
      rule: validationRules.meetupDescription,
      errorMessage: 'Description must be 10-1000 characters'
    },
    location: {
      rule: (value: string) => value.trim().length > 0,
      errorMessage: 'Location is required'
    },
    times: {
      rule: () => {
        const duration = calculateDuration()
        return duration > 0 && duration <= 480 // Max 8 hours
      },
      errorMessage: 'End time must be after start time and within 8 hours'
    }
  })

  const { validateForm, showValidationAlert } = useFormValidation(validationConfig)

  const { execute: createMeetup, isLoading } = useAsyncOperation({
    onSuccess: (result: Meetup) => {
      Alert.alert('Success', 'Meetup created successfully!')
      onMeetupCreated(result)
      handleClose()
    },
    showErrorAlert: true,
    errorMessage: 'Failed to create meetup. Please try again.'
  })

  const handleCreateMeetup = () => {
    const duration = calculateDuration()
    const formData = {
      meetupName: meetupName.trim(),
      meetupDescription: meetupDescription.trim(),
      location: location.trim(),
      times: true // Just for validation
    }

    if (!validateForm(formData)) {
      if (!validationRules.meetupName(meetupName.trim())) {
        showValidationAlert('meetupName')
        return
      }
      if (!validationRules.meetupDescription(meetupDescription.trim())) {
        showValidationAlert('meetupDescription')
        return
      }
      if (location.trim().length === 0) {
        showValidationAlert('location')
        return
      }
      if (duration <= 0) {
        showValidationAlert('times')
        return
      }
    }

    if (!userProfile?.uid) {
      Alert.alert('Error', 'User not authenticated')
      return
    }

    createMeetup(async () => {
      const meetupRef = doc(collection(db, 'meetups'))
      const meetupId = meetupRef.id
      
      // Create date and time timestamps
      const meetupDate = new Date(date)
      const meetupStartTime = new Date(date)
      meetupStartTime.setHours(startTime.getHours(), startTime.getMinutes())
      
      const newMeetup: Meetup = {
        id: meetupId,
        name: meetupName.trim(),
        description: meetupDescription.trim(),
        type: meetupType,
        location: location.trim(),
        date: meetupDate as any, // Will be converted to Timestamp by Firestore
        time: meetupStartTime as any, // Will be converted to Timestamp by Firestore
        length: duration,
        attendees: [userProfile.uid], // Creator automatically attends
        groupId: group.id,
        createdBy: userProfile.uid,
        cancelled: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const meetupForFirestore = {
        ...newMeetup,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      // Save meetup to Firestore
      await setDoc(meetupRef, meetupForFirestore)

      // Update group's meetups array
      const updatedMeetups = [...(group.meetups || []), meetupId]
      await updateDoc(doc(db, 'groups', group.id), {
        meetups: updatedMeetups,
        updatedAt: serverTimestamp()
      })

      return newMeetup
    })
  }

  const handleClose = () => {
    setMeetupName('')
    setMeetupDescription('')
    setMeetupType('virtual')
    setLocation('')
    setDate(new Date())
    setStartTime(new Date())
    const defaultEnd = new Date()
    defaultEnd.setHours(defaultEnd.getHours() + 1)
    setEndTime(defaultEnd)
    onClose()
  }

  const onDateChange = (event: any, selectedDate?: Date) => {
    datePickerModal.close() // Always close on both platforms
    if (selectedDate && event.type !== 'dismissed') {
      setDate(selectedDate)
    }
  }

  const onStartTimeChange = (event: any, selectedTime?: Date) => {
    startTimePickerModal.close() // Always close on both platforms
    if (selectedTime && event.type !== 'dismissed') {
      setStartTime(selectedTime)
      // Auto-adjust end time to maintain 1 hour duration if end time is before start time
      if (endTime <= selectedTime) {
        const newEndTime = new Date(selectedTime)
        newEndTime.setHours(selectedTime.getHours() + 1)
        setEndTime(newEndTime)
      }
    }
  }

  const onEndTimeChange = (event: any, selectedTime?: Date) => {
    endTimePickerModal.close() // Always close on both platforms
    if (selectedTime && event.type !== 'dismissed') {
      setEndTime(selectedTime)
    }
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <Page style={{ justifyContent: 'flex-start', alignItems: 'flex-start' }}>
        <CustomText style={{ marginBottom: 10 }} bold fontSize="xl">New Meetup</CustomText>
        
        <View style={styles.form}>
          {/* Basic Info */}
          <CustomInput
            label="Meetup Name"
            value={meetupName}
            onChangeText={setMeetupName}
            placeholder="Enter meetup name"
            maxLength={100}
          />
          <CustomInput
            label="Description"
            value={meetupDescription}
            onChangeText={setMeetupDescription}
            placeholder="Enter meetup description"
            multiline
            style={styles.descriptionInput}
            showCharCounter={true}
            maxLength={500}
          />

          {/* Type Selection */}
          <View style={styles.section}>
            <CustomText bold fontSize="sm" gray style={styles.sectionLabel}>Type</CustomText>
            <View style={styles.typeContainer}>
              <Chip
                selected={meetupType === 'virtual'}
                onPress={() => setMeetupType('virtual')}
                style={styles.typeChip}
              >
                Virtual
              </Chip>
              <Chip
                selected={meetupType === 'in-person'}
                onPress={() => setMeetupType('in-person')}
                style={styles.typeChip}
              >
                In Person
              </Chip>
            </View>
          </View>

          {/* Location */}
          <CustomInput
            label={meetupType === 'virtual' ? 'Meeting Link/Platform' : 'Location'}
            value={location}
            onChangeText={setLocation}
            placeholder={meetupType === 'virtual' ? 'e.g., Zoom link, Google Meet' : 'e.g., Library Room 101'}
          />

          {/* Date */}
          <View style={styles.section}>
            <CustomText bold fontSize="sm" gray style={styles.sectionLabel}>Date</CustomText>
            <CustomButton
              variant="outlined"
              onPress={datePickerModal.open}
              style={styles.fullWidthButton}
            >
              📅 {date.toLocaleDateString()}
            </CustomButton>
          </View>

          {/* Start and End Time */}
          <View style={styles.section}>
            <CustomText bold fontSize="sm" gray style={styles.sectionLabel}>Time</CustomText>
            
            <View style={styles.timeContainer}>
              <View style={styles.timeSection}>
                <CustomText fontSize="xs" gray style={styles.timeLabel}>Start Time</CustomText>
                <CustomButton
                  variant="outlined"
                  onPress={startTimePickerModal.open}
                  style={styles.timeButton}
                >
                  🕐 {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </CustomButton>
              </View>
              
              <View style={styles.timeSection}>
                <CustomText fontSize="xs" gray style={styles.timeLabel}>End Time</CustomText>
                <CustomButton
                  variant="outlined"
                  onPress={endTimePickerModal.open}
                  style={styles.timeButton}
                >
                  🕐 {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </CustomButton>
              </View>
            </View>
            
            {/* Auto-calculated Duration Display */}
            <View style={styles.durationDisplay}>
              <CustomText fontSize="sm" gray>
                Duration: {calculateDuration()} minutes ({Math.floor(calculateDuration() / 60)}h {calculateDuration() % 60}m)
              </CustomText>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonsContainer}>
            <LoadingButton
              variant="contained"
              onPress={handleCreateMeetup}
              loading={isLoading}
              disabled={!meetupName.trim() || !meetupDescription.trim() || !location.trim() || calculateDuration() <= 0}
              loadingText="Creating Meetup..."
              style={styles.createButton}
            >
              Create Meetup
            </LoadingButton>
            
            <CustomButton
              variant="outlined"
              onPress={handleClose}
              style={styles.cancelButton}
            >
              Cancel
            </CustomButton>
          </View>
        </View>
      </Page>

      {/* Date Picker - Rendered as overlay within the modal */}
      {datePickerModal.visible && (
        <View style={styles.pickerOverlay}>
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'compact' : 'default'}
            onChange={onDateChange}
            minimumDate={new Date()}
            themeVariant="light"
          />
        </View>
      )}

      {/* Start Time Picker - Rendered as overlay within the modal */}
      {startTimePickerModal.visible && (
        <View style={styles.pickerOverlay}>
          <DateTimePicker
            value={startTime}
            mode="time"
            display={Platform.OS === 'ios' ? 'compact' : 'default'}
            onChange={onStartTimeChange}
            themeVariant="light"
          />
        </View>
      )}

      {/* End Time Picker - Rendered as overlay within the modal */}
      {endTimePickerModal.visible && (
        <View style={styles.pickerOverlay}>
          <DateTimePicker
            value={endTime}
            mode="time"
            display={Platform.OS === 'ios' ? 'compact' : 'default'}
            onChange={onEndTimeChange}
            themeVariant="light"
          />
        </View>
      )}
    </Modal>
  )
}

export default MeetupCreationModal

const styles = StyleSheet.create({
  form: {
    width: '100%',
    gap: 5
  },
  descriptionInput: {
    height: 100,
  },
  section: {
    gap: 8,
  },
  sectionLabel: {
    marginBottom: 4,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  typeChip: {
    flex: 1,
  },
  fullWidthButton: {
    width: '100%',
  },
  timeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  timeSection: {
    flex: 1,
    gap: 4,
  },
  timeLabel: {
    marginBottom: 4,
  },
  timeButton: {
    width: '100%',
  },
  durationDisplay: {
    marginTop: 12,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonsContainer: {
    gap: 12,
    marginTop: 20,
  },
  createButton: {
    flex: 1,
  },
  cancelButton: {
    flex: 1,
  },
  pickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
})
