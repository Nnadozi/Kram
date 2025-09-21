import CustomButton from '@/components/CustomButton'
import CustomText from '@/components/CustomText'
import Page from '@/components/Page'
import { useUserStore } from '@/stores/userStore'
import { useState } from 'react'
import { Alert, Modal, StyleSheet, TouchableOpacity, View } from 'react-native'
import { useTheme } from 'react-native-paper'

interface ProfileColorPickerModalProps {
  visible: boolean
  onClose: () => void
}

// Predefined color palette for user selection
const COLOR_PALETTE = [
  '#FF9800', // Orange (default)
  '#F44336', // Red
  '#E91E63', // Pink
  '#9C27B0', // Purple
  '#673AB7', // Deep Purple
  '#3F51B5', // Indigo
  '#2196F3', // Blue
  '#03A9F4', // Light Blue
  '#00BCD4', // Cyan
  '#009688', // Teal
  '#4CAF50', // Green
  '#8BC34A', // Light Green
  '#CDDC39', // Lime
  '#FFEB3B', // Yellow
  '#FFC107', // Amber
  '#FF5722', // Deep Orange
  '#795548', // Brown
  '#607D8B', // Blue Grey
]

const ProfileColorPickerModal = ({ visible, onClose }: ProfileColorPickerModalProps) => {
  const { userProfile, setUserProfile } = useUserStore()
  const { colors } = useTheme()
  const [selectedColor, setSelectedColor] = useState(
    userProfile?.avatar || '#FF9800'
  )

  // Handle color selection
  const handleColorSelect = (color: string) => {
    setSelectedColor(color)
  }

  // Save the selected color
  const handleSave = () => {
    if (selectedColor && selectedColor !== userProfile?.avatar) {
      setUserProfile({ avatar: selectedColor })
      Alert.alert('Success', 'Profile color updated successfully!')
    }
    onClose()
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <Page style={{ justifyContent: 'flex-start', alignItems: 'flex-start' }}>
        {/* Header */}
        <View style={styles.modalHeader}>
          <CustomText style={{ flex: 1 }} bold fontSize="xl">
            Choose Profile Color
          </CustomText>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <CustomText fontSize="lg">✕</CustomText>
          </TouchableOpacity>
        </View>

        {/* Color Palette */}
        <View style={styles.content}>
          <CustomText bold fontSize="lg" style={styles.sectionTitle}>
            Select a Color
          </CustomText>
          
          <View style={styles.colorPalette}>
            {COLOR_PALETTE.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  selectedColor === color && styles.selectedColor
                ]}
                onPress={() => handleColorSelect(color)}
              >
                {selectedColor === color && (
                  <View style={styles.checkmark}>
                    <CustomText style={{ color: 'white', fontSize: 16 }}>✓</CustomText>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Current Selection Preview */}
          <View style={styles.previewSection}>
            <CustomText bold fontSize="lg" style={styles.sectionTitle}>
              Preview
            </CustomText>
            <View style={styles.previewContainer}>
              <View 
                style={[
                  styles.avatarPreview, 
                  { backgroundColor: selectedColor }
                ]}
              >
                <CustomText style={{ color: 'white', fontSize: 24 }}>A</CustomText>
              </View>
              <CustomText fontSize="sm" gray style={styles.previewText}>
                This color will be used for your avatar and app theme
              </CustomText>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <CustomButton
              variant="outlined"
              onPress={onClose}
              style={styles.cancelButton}
            >
              Cancel
            </CustomButton>
            <CustomButton
              onPress={handleSave}
              style={[styles.saveButton, { backgroundColor: selectedColor }]}
            >
              Save Color
            </CustomButton>
          </View>
        </View>
      </Page>
    </Modal>
  )
}

export default ProfileColorPickerModal

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
    gap: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  colorPalette: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: '#000',
    transform: [{ scale: 1.1 }],
  },
  checkmark: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewSection: {
    gap: 12,
  },
  previewContainer: {
    alignItems: 'center',
    gap: 12,
  },
  avatarPreview: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  previewText: {
    textAlign: 'center',
    maxWidth: 250,
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
