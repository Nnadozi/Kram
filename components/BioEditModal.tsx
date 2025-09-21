import CustomButton from '@/components/CustomButton'
import CustomInput from '@/components/CustomInput'
import CustomText from '@/components/CustomText'
import Page from '@/components/Page'
import { useFormValidation } from '@/hooks/useFormValidation'
import { useUserStore } from '@/stores/userStore'
import { useState } from 'react'
import { Alert, Modal, StyleSheet, TouchableOpacity, View } from 'react-native'
import { useTheme } from 'react-native-paper'

interface BioEditModalProps {
  visible: boolean
  onClose: () => void
}

const BioEditModal = ({ visible, onClose }: BioEditModalProps) => {
  const { userProfile, setUserProfile } = useUserStore()
  const { colors } = useTheme()
  const [bio, setBio] = useState(userProfile?.bio || '')

  // Form validation for bio
  const validationConfig = {
    bio: {
      rule: (value: string) => !value || value.length <= 500,
      errorMessage: 'Bio must be less than 500 characters'
    }
  }
  const { validateForm, getFieldError } = useFormValidation(validationConfig)

  // Handle bio save
  const handleSave = () => {
    // Validate bio (max 500 characters)
    const bioError = getFieldError('bio', bio)
    
    if (bioError) {
      Alert.alert('Validation Error', bioError)
      return
    }

    if (bio !== userProfile?.bio) {
      setUserProfile({ bio: bio.trim() })
      Alert.alert('Success', 'Bio updated successfully!')
    }
    onClose()
  }

  // Handle modal close
  const handleClose = () => {
    setBio(userProfile?.bio || '') // Reset to original value
    onClose()
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <Page style={{ justifyContent: 'flex-start', alignItems: 'flex-start' }}>
        {/* Header */}
        <View style={styles.modalHeader}>
          <CustomText style={{ flex: 1 }} bold fontSize="xl">
            Edit Bio
          </CustomText>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <CustomText fontSize="lg">✕</CustomText>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <CustomText bold fontSize="lg" style={styles.sectionTitle}>
            Tell us about yourself
          </CustomText>
          
          <CustomText fontSize="sm" gray style={styles.description}>
            Share a brief description about yourself, your interests, or what you're looking for in study groups.
          </CustomText>

          <CustomInput
            label="Bio"
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={6}
            placeholder="Write something about yourself..."
            error={!!getFieldError('bio', bio)}
            style={styles.bioInput}
            maxLength={500}
          />

          {/* Character count */}
          <CustomText fontSize="xs" gray style={styles.characterCount}>
            {bio.length}/500 characters
          </CustomText>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <CustomButton
              variant="outlined"
              onPress={handleClose}
              style={styles.cancelButton}
            >
              Cancel
            </CustomButton>
            <CustomButton
              onPress={handleSave}
              style={styles.saveButton}
            >
              Save Bio
            </CustomButton>
          </View>
        </View>
      </Page>
    </Modal>
  )
}

export default BioEditModal

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
  content: {
    width: '100%',
    gap: 16,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  description: {
    marginBottom: 8,
    lineHeight: 18,
  },
  bioInput: {
    minHeight: 120,
  },
  characterCount: {
    textAlign: 'right',
    marginTop: -8,
  },
  actionButtons: {
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    width: '100%',
  },
  saveButton: {
    width: '100%',
  },
})

// DONE!
