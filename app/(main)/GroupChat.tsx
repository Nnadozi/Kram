import CustomButton from '@/components/CustomButton'
import CustomInput from '@/components/CustomInput'
import CustomText from '@/components/CustomText'
import Message from '@/components/Message'
import Page from '@/components/Page'
import { useAsyncOperation } from '@/hooks/useAsyncOperation'
import { messageService } from '@/services/messageService'
import { useUserStore } from '@/stores/userStore'
import { Message as MessageType } from '@/types/Message'
import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { Alert, FlatList, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native'
import { IconButton, useTheme } from 'react-native-paper'

const GroupChat = () => {
  const { groupId } = useLocalSearchParams<{ groupId: string }>()
  const { colors } = useTheme()
  const { authUser, userProfile } = useUserStore()
  const [messages, setMessages] = useState<MessageType[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoadingMessages, setIsLoadingMessages] = useState(true)

  const { execute: sendMessage, isLoading: isSending } = useAsyncOperation({
    onError: (error) => {
      Alert.alert('Error', error.message)
    }
  })

  const { execute: deleteMessage, isLoading: isDeleting } = useAsyncOperation({
    onError: (error) => {
      Alert.alert('Error', error.message)
    }
  })

  // Set up real-time message listener when component mounts
  useEffect(() => {
    if (!groupId || !authUser?.uid) return

    // Set up real-time listener for messages
    const unsubscribe = messageService.subscribeToMessages(
      groupId,
      (newMessages) => {
        setMessages(newMessages)
        setIsLoadingMessages(false)
      },
      (error) => {
        console.error('Real-time listener error:', error)
        Alert.alert('Error', 'Failed to load messages in real-time')
        setIsLoadingMessages(false)
      }
    )

    // Cleanup listener when component unmounts
    return unsubscribe
  }, [groupId, authUser?.uid])

  const loadRecentMessages = async () => {
    try {
      setIsLoadingMessages(true)
      const recentMessages = await messageService.getRecentMessages(groupId!)
      setMessages(recentMessages)
    } catch (error) {
      console.error('Error loading messages:', error)
      Alert.alert('Error', 'Failed to load messages')
    } finally {
      setIsLoadingMessages(false)
    }
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !groupId || !authUser?.uid || !userProfile) {
      return
    }

    const messageText = newMessage.trim()
    setNewMessage('')

    sendMessage(async () => {
      await messageService.sendMessage(
        groupId,
        authUser.uid,
        `${userProfile.firstName} ${userProfile.lastName}`,
        messageText
      )
      // Real-time listener will automatically update the messages
    })
  }

  const handleDeleteMessage = (messageId: string) => {
    if (!groupId || !authUser?.uid) {
      return
    }

    deleteMessage(async () => {
      await messageService.deleteMessage(groupId, messageId, authUser.uid)
      // Real-time listener will automatically update the messages
    })
  }

  const renderMessage = ({ item }: { item: MessageType }) => {
    const isOwnMessage = item.senderId === authUser?.uid
    return (
      <Message
        message={item}
        isOwnMessage={isOwnMessage}
        onDelete={handleDeleteMessage}
        currentUserId={authUser?.uid || ''}
      />
    )
  }

  if (!groupId) {
    return (
      <Page>
        <CustomText>Error: No group ID provided</CustomText>
      </Page>
    )
  }

  if (!authUser?.uid) {
    return (
      <Page>
        <CustomText>Error: User not authenticated</CustomText>
      </Page>
    )
  }

  return (
    <Page>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <IconButton
            icon="arrow-left"
            onPress={() => router.back()}
            size={24}
            iconColor={"red"}
          />
          <CustomText bold fontSize="lg">Group Chat</CustomText>
        </View>

        {/* Messages List */}
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id || Math.random().toString()}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          inverted={false}
          onRefresh={loadRecentMessages}
          refreshing={isLoadingMessages}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <CustomText fontSize="base" style={{ color: colors.onSurfaceVariant }}>
                No messages yet. Start the conversation!
              </CustomText>
            </View>
          }
        />

        {/* Message Input */}
        <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderTopColor: colors.outline }]}>
          <CustomInput
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            multiline
            style={styles.messageInput}
            maxLength={1000}
          />
          <CustomButton
            onPress={handleSendMessage}
            disabled={!newMessage.trim() || isSending}
            style={styles.sendButton}
          >
            Send
          </CustomButton>
        </View>
      </KeyboardAvoidingView>
    </Page>
  )
}

export default GroupChat

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 8,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  inputContainer: {
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    gap: 12,
  },
  messageInput: {
    flex: 1,
    maxHeight: 100,
  },
  sendButton: {
    minWidth: 80,
  },
})

// DONE! Added real-time message updates for all users in group chat
