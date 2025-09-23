import CustomText from '@/components/CustomText'
import { useThemeStore } from '@/stores/themeStore'
import { Message as MessageType } from '@/types/Message'
import { useState } from 'react'
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native'
import { useTheme as usePaperTheme } from 'react-native-paper'

interface MessageProps {
  message: MessageType
  isOwnMessage: boolean
  onDelete?: (messageId: string) => void
  currentUserId: string
}

const Message = ({ message, isOwnMessage, onDelete, currentUserId }: MessageProps) => {
  const { colors } = usePaperTheme()
  const { primaryColor } = useThemeStore()
  const [showDeleteOption, setShowDeleteOption] = useState(false)

  const handleLongPress = () => {
    // Only allow deletion of own messages
    if (message.senderId === currentUserId && onDelete) {
      setShowDeleteOption(true)
    }
  }

  const handleDelete = () => {
    Alert.alert(
      'Delete Message',
      'Are you sure you want to delete this message?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => setShowDeleteOption(false)
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (onDelete && message.id) {
              onDelete(message.id)
              setShowDeleteOption(false)
            }
          }
        }
      ]
    )
  }

  const formatSenderName = (senderName: string) => {
    try {
      const nameParts = senderName.trim().split(' ')
      if (nameParts.length >= 2) {
        const firstName = nameParts[0]
        const lastNameInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase()
        return `${firstName} ${lastNameInitial}`
      }
      return senderName
    } catch (error) {
      return senderName
    }
  }

  const formatTimestamp = (timestamp: any) => {
    try {
      // Handle both Date objects and Firestore Timestamps
      const date = timestamp instanceof Date ? timestamp : timestamp.toDate()
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    } catch (error) {
      return 'Just now'
    }
  }

  return (
    <TouchableOpacity
      style={[
        styles.messageContainer,
        isOwnMessage ? styles.ownMessage : styles.otherMessage
      ]}
      onLongPress={handleLongPress}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.messageBubble,
          {
            backgroundColor: isOwnMessage ? primaryColor : colors.surface,
            borderColor: isOwnMessage ? primaryColor : colors.outline,
          }
        ]}
      >
        <CustomText fontSize='sm' style={{ ...styles.senderName, color: isOwnMessage ? 'rgba(255,255,255,0.8)' : colors.onSurface }}>
          {formatSenderName(message.senderName)}
        </CustomText>
        
        <CustomText
          fontSize='base'
          style={{ ...styles.messageText, color: isOwnMessage ? '#fff' : colors.onSurface }}
        >
          {message.text}
        </CustomText>
        
        <CustomText
          fontSize='xs'
          style={{ ...styles.timestamp, color: isOwnMessage ? 'rgba(255,255,255,0.7)' : colors.onSurfaceVariant }}
        >
          {formatTimestamp(message.timestamp)}
        </CustomText>
      </View>

      {showDeleteOption && (
        <View style={styles.deleteContainer}>
          <TouchableOpacity
            style={[styles.deleteButton, { backgroundColor: colors.errorContainer }]}
            onPress={handleDelete}
          >
            <CustomText fontSize='sm' style={{ color: colors.onErrorContainer }}>
              Delete
            </CustomText>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  )
}

export default Message

const styles = StyleSheet.create({
  messageContainer: {
    marginVertical: 4,
    paddingHorizontal: 16,
  },
  ownMessage: {
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  senderName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  messageText: {
    lineHeight: 20,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 10,
    textAlign: 'right',
  },
  deleteContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
})

// DONE! Updated to show sender name (First + Last initial) and 12-hour time format
