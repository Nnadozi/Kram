import { db } from '@/firebase/firebaseConfig'
import { UserProfile } from '@/types/UserProfile'
import { validationRules } from '@/util/validation'
import {
  arrayRemove,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch
} from 'firebase/firestore'

/**
 * User service handles all business logic related to user profiles and user data management
 * This includes profile creation, updates, retrieval, and deletion
 */
export class UserService {

  /**
   * Gets a user profile by user ID
   */
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    if (!userId) {
      throw new Error('User ID is required')
    }

    try {
      const userDocRef = doc(db, 'users', userId)
      const userDoc = await getDoc(userDocRef)

      if (!userDoc.exists()) {
        return null
      }

      return { uid: userDoc.id, ...userDoc.data() } as UserProfile
    } catch (error) {
      console.error('Error fetching user profile:', error)
      throw new Error('Failed to load user profile')
    }
  }

  /**
   * Updates user profile with validation and business rules
   */
  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    if (!userId) {
      throw new Error('User ID is required')
    }

    // Business rule: Validate profile data before updating
    this.validateProfileUpdates(updates)

    try {
      const userDocRef = doc(db, 'users', userId)
      
      // Business rule: Always update the timestamp when profile changes
      const profileWithTimestamp = {
        ...updates,
        updatedAt: serverTimestamp()
      }

      await updateDoc(userDocRef, profileWithTimestamp)
    } catch (error) {
      console.error('Error updating user profile:', error)
      throw new Error('Failed to update profile. Please try again.')
    }
  }

  /**
   * Completes user onboarding process
   * This is a specific business operation that marks onboarding as complete
   */
  async completeOnboarding(userId: string, profileData: Partial<UserProfile>): Promise<void> {
    // Business rule: Required fields for onboarding completion
    const requiredFields = ['firstName', 'lastName', 'school', 'graduationYear']
    const missingFields = requiredFields.filter(field => !profileData[field as keyof UserProfile])
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
    }

    // Business rule: Mark onboarding as complete
    const completeProfileData = {
      ...profileData,
      onboardingComplete: true
    }

    await this.updateUserProfile(userId, completeProfileData)
  }

  /**
   * Adds a user to a group
   */
  async joinGroup(userId: string, groupId: string): Promise<void> {
    if (!userId || !groupId) {
      throw new Error('User ID and Group ID are required')
    }

    try {
      // Get current user profile to check existing groups
      const userProfile = await this.getUserProfile(userId)
      if (!userProfile) {
        throw new Error('User profile not found')
      }

      // Business rule: Don't add duplicate groups
      const currentGroups = userProfile.groups || []
      if (currentGroups.includes(groupId)) {
        throw new Error('User is already a member of this group')
      }

      // Add group to user's groups array
      const updatedGroups = [...currentGroups, groupId]
      await this.updateUserProfile(userId, { groups: updatedGroups })
    } catch (error) {
      console.error('Error joining group:', error)
      throw error
    }
  }

  /**
   * Removes a user from a group
   */
  async leaveGroup(userId: string, groupId: string): Promise<void> {
    if (!userId || !groupId) {
      throw new Error('User ID and Group ID are required')
    }

    try {
      const userProfile = await this.getUserProfile(userId)
      if (!userProfile) {
        throw new Error('User profile not found')
      }

      // Business rule: Remove group from user's groups array
      const currentGroups = userProfile.groups || []
      const updatedGroups = currentGroups.filter(id => id !== groupId)
      
      await this.updateUserProfile(userId, { groups: updatedGroups })
    } catch (error) {
      console.error('Error leaving group:', error)
      throw error
    }
  }

  /**
   * Deletes a user's document from Firestore and removes them from all groups and meetups
   * This is used when deleting the entire user account
   */
  async deleteUserDocument(userId: string): Promise<void> {
    if (!userId) {
      throw new Error('User ID is required')
    }

    try {
      // Get user profile to find all groups they're in
      const userProfile = await this.getUserProfile(userId)
      if (!userProfile) {
        throw new Error('User profile not found')
      }

      const userGroups = userProfile.groups || []
      
      // Use batch operations for atomic updates
      const batch = writeBatch(db)

      // Remove user from all groups they're members of
      for (const groupId of userGroups) {
        const groupDocRef = doc(db, 'groups', groupId)
        batch.update(groupDocRef, {
          members: arrayRemove(userId),
          updatedAt: serverTimestamp()
        })
      }

      // Remove user from all meetups they're attending
      // Query all meetups where user is in attendees array
      const meetupsQuery = query(
        collection(db, 'meetups'),
        where('attendees', 'array-contains', userId)
      )
      const meetupsSnapshot = await getDocs(meetupsQuery)
      
      meetupsSnapshot.forEach((meetupDoc) => {
        const meetupRef = doc(db, 'meetups', meetupDoc.id)
        batch.update(meetupRef, {
          attendees: arrayRemove(userId),
          updatedAt: serverTimestamp()
        })
      })

      // Delete user's own document
      const userDocRef = doc(db, 'users', userId)
      batch.delete(userDocRef)

      // Commit all changes atomically
      await batch.commit()
      
      console.log(`Successfully removed user ${userId} from ${userGroups.length} groups and ${meetupsSnapshot.size} meetups`)
    } catch (error) {
      console.error('Error deleting user document:', error)
      throw new Error('Failed to delete user data')
    }
  }

  /**
   * Gets attendee profiles in batches (handles Firestore 'in' query limit of 10)
   * Moved from firebaseUtils.ts
   */
  async getAttendeeProfiles(attendeeIds: string[]): Promise<UserProfile[]> {
    if (!attendeeIds || attendeeIds.length === 0) {
      return []
    }

    try {
      const profiles: UserProfile[] = []
      const batchSize = 10 // Firestore 'in' query limit
      
      // Process attendees in batches
      for (let i = 0; i < attendeeIds.length; i += batchSize) {
        const batch = attendeeIds.slice(i, i + batchSize)
        const q = query(collection(db, 'users'), where('uid', 'in', batch))
        const querySnapshot = await getDocs(q)
        
        querySnapshot.forEach((doc) => {
          profiles.push({ uid: doc.id, ...doc.data() } as UserProfile)
        })
      }
      
      return profiles
    } catch (error) {
      console.error('Error loading attendee profiles:', error)
      throw new Error('Failed to load user profiles')
    }
  }

  /**
   * Batch get documents by IDs (generic utility)
   * Moved from firebaseUtils.ts
   */
  async batchGetDocuments<T>(collectionName: string, ids: string[]): Promise<T[]> {
    if (!ids || ids.length === 0) {
      return []
    }

    try {
      const documents: T[] = []
      
      // Firestore batch get is limited to 10 documents
      const batchSize = 10
      for (let i = 0; i < ids.length; i += batchSize) {
        const batch = ids.slice(i, i + batchSize)
        const promises = batch.map(id => getDoc(doc(db, collectionName, id)))
        const docs = await Promise.all(promises)
        
        docs.forEach((docSnap) => {
          if (docSnap.exists()) {
            documents.push({ id: docSnap.id, ...docSnap.data() } as T)
          }
        })
      }
      
      return documents
    } catch (error) {
      console.error(`Error batch getting documents from ${collectionName}:`, error)
      throw new Error(`Failed to load ${collectionName} data`)
    }
  }

  /**
   * Validates profile update data according to business rules
   * This is a private method that encapsulates validation logic
   */
  private validateProfileUpdates(updates: Partial<UserProfile>): void {
    // Validate first name if provided
    if (updates.firstName !== undefined && !validationRules.firstName(updates.firstName)) {
      throw new Error('First name is required and must be valid')
    }

    // Validate last name if provided
    if (updates.lastName !== undefined && !validationRules.lastName(updates.lastName)) {
      throw new Error('Last name is required and must be valid')
    }

    // Validate school if provided
    if (updates.school !== undefined && !validationRules.school(updates.school)) {
      throw new Error('School name is required')
    }

    // Validate graduation year if provided
    if (updates.graduationYear !== undefined && !validationRules.graduationYear(updates.graduationYear)) {
      throw new Error('Graduation year must be valid')
    }

    // Validate phone if provided
    if (updates.phone !== undefined && updates.phone && !validationRules.phone(updates.phone)) {
      throw new Error('Phone number format is invalid')
    }

    // Validate bio if provided
    if (updates.bio !== undefined && !validationRules.bio(updates.bio)) {
      throw new Error('Bio is too long (max 500 characters)')
    }
  }
}

// Export singleton instance
export const userService = new UserService()
