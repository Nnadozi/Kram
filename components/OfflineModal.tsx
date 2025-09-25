import { MaterialIcons } from '@expo/vector-icons'
import { Modal, StyleSheet, View } from 'react-native'
import { useTheme } from 'react-native-paper'
import CustomButton from './CustomButton'
import CustomText from './CustomText'

interface OfflineModalProps {
  visible: boolean
  onClose: () => void
  onRetry?: () => void
  title?: string
  message?: string
}

/**
 * OfflineModal shows a modal dialog when user attempts an action requiring internet
 * Provides retry option and clear messaging about connectivity requirements
 */
export const OfflineModal = ({ 
  visible, 
  onClose, 
  onRetry,
  title = "You're Offline",
  message = "This action requires an internet connection. Please check your connection and try again."
}: OfflineModalProps) => {
  const { colors } = useTheme()

  const handleRetry = () => {
    onClose()
    if (onRetry) {
      setTimeout(onRetry, 300) // Small delay for modal to close
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.surface }]}>
          {/* Icon */}
          <View style={[styles.iconContainer, { backgroundColor: colors.errorContainer }]}>
            <MaterialIcons 
              name="wifi-off" 
              size={48} 
              color={colors.onErrorContainer} 
            />
          </View>

          {/* Title */}
          <CustomText 
            fontSize="xl" 
            bold 
            textAlign="center"
            style={styles.title}
          >
            {title}
          </CustomText>

          {/* Message */}
          <CustomText 
            fontSize="base" 
            gray
            textAlign="center"
            style={styles.message}
          >
            {message}
          </CustomText>

          {/* Actions */}
          <View style={styles.buttonContainer}>
            {onRetry && (
              <CustomButton
                variant="contained"
                onPress={handleRetry}
                style={styles.button}
              >
                Try Again
              </CustomButton>
            )}
            <CustomButton
              variant={onRetry ? "outlined" : "contained"}
              onPress={onClose}
              style={styles.button}
            >
              {onRetry ? 'Cancel' : 'OK'}
            </CustomButton>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
  },
  message: {
    marginBottom: 24,
    lineHeight: 20,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  button: {
    width: '100%',
  },
})
