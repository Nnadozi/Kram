import { db } from '@/firebaseConfig'
import { Message } from '@/types/Message'
import { validationRules } from '@/util/validation'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where
} from 'firebase/firestore'

/**
 * Message service handles all business logic related to group chat messages
 * This includes sending messages, retrieving messages, and deleting messages
 */
export class MessageService {

  /**
   * Sends a new message to a group chat
   */
  async sendMessage(groupId: string, senderId: string, senderName: string, text: string): Promise<string> {
    if (!groupId || !senderId || !senderName || !text) {
      throw new Error('Group ID, sender ID, sender name, and message text are required')
    }

    // Business rule: Validate message text
    if (!validationRules.messageText(text)) {
      throw new Error('Message must be between 1 and 1000 characters')
    }

    try {
      // Business rule: Create message document in messages subcollection
      const newMessage = {
        senderId,
        senderName,
        text: text.trim(),
        timestamp: serverTimestamp(),
        createdAt: serverTimestamp()
      }

      const messagesRef = collection(db, 'groups', groupId, 'messages')
      const docRef = await addDoc(messagesRef, newMessage)
      
      return docRef.id
    } catch (error) {
      console.error('Error sending message:', error)
      throw new Error('Failed to send message. Please try again.')
    }
  }

  /**
   * Gets the last 10 messages from a group chat
   * Used when user joins the chat
   */
  async getRecentMessages(groupId: string): Promise<Message[]> {
    if (!groupId) {
      throw new Error('Group ID is required')
    }

    try {
      const messagesRef = collection(db, 'groups', groupId, 'messages')
      const messagesQuery = query(
        messagesRef,
        orderBy('timestamp', 'desc'),
        limit(10)
      )

      const querySnapshot = await getDocs(messagesQuery)
      const messages: Message[] = []

      querySnapshot.forEach((doc) => {
        messages.push({
          id: doc.id,
          ...doc.data()
        } as Message)
      })

      // Return messages in chronological order (oldest first)
      return messages.reverse()
    } catch (error) {
      console.error('Error getting recent messages:', error)
      throw new Error('Failed to load messages')
    }
  }

  /**
   * Gets all messages from a group chat (for real-time updates)
   * This would typically be used with onSnapshot for real-time listening
   */
  async getAllMessages(groupId: string): Promise<Message[]> {
    if (!groupId) {
      throw new Error('Group ID is required')
    }

    try {
      const messagesRef = collection(db, 'groups', groupId, 'messages')
      const messagesQuery = query(
        messagesRef,
        orderBy('timestamp', 'asc')
      )

      const querySnapshot = await getDocs(messagesQuery)
      const messages: Message[] = []

      querySnapshot.forEach((doc) => {
        messages.push({
          id: doc.id,
          ...doc.data()
        } as Message)
      })

      return messages
    } catch (error) {
      console.error('Error getting all messages:', error)
      throw new Error('Failed to load messages')
    }
  }

  /**
   * Deletes a message (only sender can delete their own messages)
   */
  async deleteMessage(groupId: string, messageId: string, userId: string): Promise<void> {
    if (!groupId || !messageId || !userId) {
      throw new Error('Group ID, message ID, and user ID are required')
    }

    try {
      // Business rule: Verify user is the sender before deleting
      const messageRef = doc(db, 'groups', groupId, 'messages', messageId)
      const messageDoc = await getDoc(messageRef)
      
      if (!messageDoc.exists()) {
        throw new Error('Message not found')
      }
      
      const messageData = messageDoc.data()
      
      // Business rule: Only the sender can delete their own message
      if (messageData.senderId !== userId) {
        throw new Error('You can only delete your own messages')
      }
      
      await deleteDoc(messageRef)
    } catch (error) {
      console.error('Error deleting message:', error)
      if (error instanceof Error && error.message.includes('only delete your own')) {
        throw error // Re-throw ownership error
      }
      throw new Error('Failed to delete message. Please try again.')
    }
  }

  /**
   * Sets up real-time listener for group chat messages
   * Returns unsubscribe function to stop listening
   */
  subscribeToMessages(
    groupId: string, 
    onMessagesUpdate: (messages: Message[]) => void,
    onError?: (error: Error) => void
  ): () => void {
    if (!groupId) {
      onError?.(new Error('Group ID is required'))
      return () => {}
    }

    try {
      const messagesRef = collection(db, 'groups', groupId, 'messages')
      const messagesQuery = query(
        messagesRef,
        orderBy('timestamp', 'asc')
      )

      const unsubscribe = onSnapshot(
        messagesQuery,
        (querySnapshot) => {
          const messages: Message[] = []
          querySnapshot.forEach((doc) => {
            messages.push({
              id: doc.id,
              ...doc.data()
            } as Message)
          })
          onMessagesUpdate(messages)
        },
        (error) => {
          console.error('Error listening to messages:', error)
          onError?.(new Error('Failed to listen to messages'))
        }
      )

      return unsubscribe
    } catch (error) {
      console.error('Error setting up message listener:', error)
      onError?.(new Error('Failed to set up message listener'))
      return () => {}
    }
  }

  /**
   * Checks if a user is a member of the group (for authorization)
   */
  async isGroupMember(groupId: string, userId: string): Promise<boolean> {
    if (!groupId || !userId) {
      return false
    }

    try {
      const groupRef = doc(db, 'groups', groupId)
      const groupDoc = await getDocs(query(collection(db, 'groups'), where('id', '==', groupId)))
      
      if (groupDoc.empty) {
        return false
      }

      const groupData = groupDoc.docs[0].data()
      return groupData.members && groupData.members.includes(userId)
    } catch (error) {
      console.error('Error checking group membership:', error)
      return false
    }
  }
}

// Export singleton instance
export const messageService = new MessageService()

// DONE! Added real-time message updates and proper message ownership verification for deletion
