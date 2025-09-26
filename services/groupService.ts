import { db } from '@/firebaseConfig'
import { Group } from '@/types/Group'
import { UserProfile } from '@/types/UserProfile'
import { validationRules } from '@/util/validation'
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where
} from 'firebase/firestore'

/**
 * Group service handles all business logic related to groups
 * This includes group creation, updates, member management, and group operations
 */
export class GroupService {

  /**
   * Creates a new group with validation and business rules
   */
  async createGroup(groupData: {
    name: string
    description: string
    subject: string
    createdBy: string
    isPrivate?: boolean
  }): Promise<string> {
    // Business rule: Validate required group data
    this.validateGroupData(groupData)

    try {
      // Business rule: Set up initial group structure
      const newGroup = {
        name: groupData.name,
        description: groupData.description,
        subjects: [groupData.subject], // Convert single subject to array
        createdBy: groupData.createdBy,
        isPrivate: groupData.isPrivate || false,
        members: [groupData.createdBy], // Creator is automatically a member
        meetups: [], // Initialize empty meetups array
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      const docRef = await addDoc(collection(db, 'groups'), newGroup)
      return docRef.id
    } catch (error) {
      console.error('Error creating group:', error)
      throw new Error('Failed to create group. Please try again.')
    }
  }

  /**
   * Gets a single group by ID with error handling
   * Moved from firebaseUtils.ts
   */
  async getGroup(groupId: string): Promise<Group | null> {
    if (!groupId) {
      throw new Error('Group ID is required')
    }

    try {
      const groupDoc = await getDoc(doc(db, 'groups', groupId))
      if (!groupDoc.exists()) {
        return null
      }
      return { id: groupDoc.id, ...groupDoc.data() } as Group
    } catch (error) {
      console.error(`Error loading group ${groupId}:`, error)
      throw new Error('Failed to load group')
    }
  }

  /**
   * Gets multiple groups by their IDs
   * Moved from firebaseUtils.ts - renamed from getUserGroups
   */
  async getGroups(groupIds: string[]): Promise<Group[]> {
    if (!groupIds || groupIds.length === 0) {
      return []
    }

    try {
      const groups: Group[] = []
      
      // Fetch each group by ID (could optimize with batch get in the future)
      for (const groupId of groupIds) {
        try {
          const groupDoc = await getDoc(doc(db, 'groups', groupId))
          if (groupDoc.exists()) {
            groups.push({ id: groupDoc.id, ...groupDoc.data() } as Group)
          }
        } catch (error) {
          console.error(`Error loading group ${groupId}:`, error)
          // Continue loading other groups even if one fails
        }
      }
      
      return groups
    } catch (error) {
      console.error('Error loading user groups:', error)
      throw new Error('Failed to load groups')
    }
  }

  /**
   * Updates group information
   */
  async updateGroup(groupId: string, updates: Partial<Group>): Promise<void> {
    if (!groupId) {
      throw new Error('Group ID is required')
    }

    // Business rule: Validate updates if they include name or description
    if (updates.name || updates.description) {
      // Only validate if name or description are being updated
      if (updates.name) {
        if (!validationRules.groupName(updates.name)) {
          throw new Error('Group name must be between 3 and 50 characters')
        }
      }
      
      if (updates.description) {
        if (!validationRules.groupDescription(updates.description)) {
          throw new Error('Group description must be between 10 and 500 characters')
        }
      }
    }

    try {
      const groupDocRef = doc(db, 'groups', groupId)
      
      // Business rule: Always update timestamp when group changes
      const updatesWithTimestamp = {
        ...updates,
        updatedAt: serverTimestamp()
      }

      await updateDoc(groupDocRef, updatesWithTimestamp)
    } catch (error) {
      console.error('Error updating group:', error)
      throw new Error('Failed to update group. Please try again.')
    }
  }

  /**
   * Adds a member to a group
   */
  async addMemberToGroup(groupId: string, userId: string): Promise<void> {
    if (!groupId || !userId) {
      throw new Error('Group ID and User ID are required')
    }

    try {
      // Business rule: Check if group exists
      const group = await this.getGroup(groupId)
      if (!group) {
        throw new Error('Group not found')
      }

      // Business rule: Check if user is already a member
      if (group.members && group.members.includes(userId)) {
        throw new Error('User is already a member of this group')
      }

      const groupDocRef = doc(db, 'groups', groupId)
      
      // Business rule: Add member to group
      await updateDoc(groupDocRef, {
        members: arrayUnion(userId),
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Error adding member to group:', error)
      throw error
    }
  }

  /**
   * Removes a member from a group
   */
  async removeMemberFromGroup(groupId: string, userId: string): Promise<void> {
    if (!groupId || !userId) {
      throw new Error('Group ID and User ID are required')
    }

    try {
      const group = await this.getGroup(groupId)
      if (!group) {
        throw new Error('Group not found')
      }

      // Business rule: Cannot remove the creator unless transferring ownership
      if (group.createdBy === userId) {
        throw new Error('Group creator cannot leave the group. Transfer ownership first.')
      }

      const groupDocRef = doc(db, 'groups', groupId)
      
      // Business rule: Remove member from group
      await updateDoc(groupDocRef, {
        members: arrayRemove(userId),
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Error removing member from group:', error)
      throw error
    }
  }

  /**
   * Gets group members (user profiles) for a group
   * Moved from firebaseUtils.ts
   */
  async getGroupMembers(groupId: string): Promise<UserProfile[]> {
    if (!groupId) {
      throw new Error('Group ID is required')
    }

    try {
      const group = await this.getGroup(groupId)
      if (!group || !group.members || group.members.length === 0) {
        return []
      }

      // Use the same logic as getAttendeeProfiles from userService
      const profiles: UserProfile[] = []
      const batchSize = 10 // Firestore 'in' query limit
      
      // Process members in batches
      for (let i = 0; i < group.members.length; i += batchSize) {
        const batch = group.members.slice(i, i + batchSize)
        const q = query(collection(db, 'users'), where('uid', 'in', batch))
        const querySnapshot = await getDocs(q)
        
        querySnapshot.forEach((doc) => {
          profiles.push({ uid: doc.id, ...doc.data() } as UserProfile)
        })
      }
      
      return profiles
    } catch (error) {
      console.error('Error loading group members:', error)
      throw new Error('Failed to load group members')
    }
  }

  /**
   * Deletes a group (only creator can do this)
   */
  async deleteGroup(groupId: string, userId: string): Promise<void> {
    if (!groupId || !userId) {
      throw new Error('Group ID and User ID are required')
    }

    try {
      const group = await this.getGroup(groupId)
      if (!group) {
        throw new Error('Group not found')
      }

      // Business rule: Only creator can delete the group
      if (group.createdBy !== userId) {
        throw new Error('Only the group creator can delete this group')
      }

      const groupDocRef = doc(db, 'groups', groupId)
      await deleteDoc(groupDocRef)
    } catch (error) {
      console.error('Error deleting group:', error)
      throw error
    }
  }

  /**
   * Transfers group ownership to another member
   */
  async transferOwnership(groupId: string, currentOwnerId: string, newOwnerId: string): Promise<void> {
    if (!groupId || !currentOwnerId || !newOwnerId) {
      throw new Error('Group ID, current owner ID, and new owner ID are required')
    }

    try {
      const group = await this.getGroup(groupId)
      if (!group) {
        throw new Error('Group not found')
      }

      // Business rule: Only current owner can transfer ownership
      if (group.createdBy !== currentOwnerId) {
        throw new Error('Only the current owner can transfer ownership')
      }

      // Business rule: New owner must be a member of the group
      if (!group.members || !group.members.includes(newOwnerId)) {
        throw new Error('New owner must be a member of the group')
      }

      await this.updateGroup(groupId, { createdBy: newOwnerId })
    } catch (error) {
      console.error('Error transferring ownership:', error)
      throw error
    }
  }

  /**
   * Validates group data according to business rules
   * This is a private method that encapsulates validation logic
   */
  private validateGroupData(groupData: {
    name: string
    description: string
    subject: string
    createdBy: string
  }): void {
    // Business rule: Group name validation
    if (!validationRules.groupName(groupData.name)) {
      throw new Error('Group name must be between 3 and 50 characters')
    }

    // Business rule: Group description validation
    if (!validationRules.groupDescription(groupData.description)) {
      throw new Error('Group description must be between 10 and 500 characters')
    }

    // Business rule: Subject is required
    if (!groupData.subject || groupData.subject.trim().length === 0) {
      throw new Error('Subject is required')
    }

    // Business rule: Creator ID is required
    if (!groupData.createdBy || groupData.createdBy.trim().length === 0) {
      throw new Error('Creator ID is required')
    }
  }
}

// Export singleton instance
export const groupService = new GroupService()
