import CustomButton from '@/components/CustomButton'
import CustomText from '@/components/CustomText'
import { useThemeStore } from '@/stores/themeStore'
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native'
import { useTheme as usePaperTheme } from 'react-native-paper'

interface DeleteAccountModalProps {
  visible: boolean
  onClose: () => void
  onConfirm: () => void
  isLoading?: boolean
}

const DeleteAccountModal = ({ visible, onClose, onConfirm, isLoading = false }: DeleteAccountModalProps) => {
  const { colors } = usePaperTheme()
  const { primaryColor } = useThemeStore()

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.surface }]}>
          <View style={styles.header}>
            <CustomText bold fontSize='lg' style={{ color: '#ff4444' }}>Delete Account</CustomText>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <CustomText bold fontSize='lg'>×</CustomText>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <CustomText fontSize='base' style={styles.warningText}>
              ⚠️ This action cannot be undone
            </CustomText>
            
            <CustomText fontSize='base' style={styles.description}>
              Deleting your account will permanently remove:
            </CustomText>
            
            <View style={styles.listContainer}>
              <CustomText fontSize='sm' style={styles.listItem}>
                • Your profile and personal information
              </CustomText>
              <CustomText fontSize='sm' style={styles.listItem}>
                • Your membership in all groups
              </CustomText>
              <CustomText fontSize='sm' style={styles.listItem}>
                • Your attendance in all meetups
              </CustomText>
              <CustomText fontSize='sm' style={styles.listItem}>
                • All your created groups and meetups
              </CustomText>
            </View>

            <CustomText fontSize='base' style={styles.finalWarning}>
              Are you absolutely sure you want to delete your account?
            </CustomText>
          </View>

          <View style={styles.buttonContainer}>
            <CustomButton 
              variant="outlined" 
              onPress={onClose}
              style={styles.cancelButton}
              disabled={isLoading}
            >
              Cancel
            </CustomButton>
            
            <CustomButton 
              variant="outlined" 
              onPress={onConfirm}
              style={[styles.deleteButton, { borderColor: '#ff4444' }]}
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Delete Account'}
            </CustomButton>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default DeleteAccountModal

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  closeButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  warningText: {
    color: '#ff4444',
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  description: {
    marginBottom: 16,
    lineHeight: 22,
  },
  listContainer: {
    marginBottom: 20,
    paddingLeft: 16,
  },
  listItem: {
    marginBottom: 8,
    lineHeight: 20,
  },
  finalWarning: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ff4444',
    marginBottom: 8,
  },
  buttonContainer: {
    padding: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  deleteButton: {
    flex: 1,
  },
})
