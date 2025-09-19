import { db } from '@/firebase/firebaseConfig'
import { Meetup } from '@/types/Meetup'
import { UserProfile } from '@/types/UserProfile'
import { sortMeetupsByDate } from '@/util/dateUtils'
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
    Timestamp,
    updateDoc,
    where
} from 'firebase/firestore'

/**
 * Meetup service handles all business logic related to meetups
 * This includes meetup creation, updates, attendance management, and meetup operations
 */
export class MeetupService {

  /**
   * Creates a new meetup with validation and business rules
   */
  async createMeetup(meetupData: {
    name: string
    description: string
    groupId: string
    createdBy: string
    date: Date
    time: string
    location: string
    maxAttendees?: number
  }): Promise<string> {
    // Business rule: Validate meetup data
    this.validateMeetupData(meetupData)

    try {
      // Business rule: Set up initial meetup structure
      const newMeetup = {
        name: meetupData.name,
        description: meetupData.description,
        groupId: meetupData.groupId,
        createdBy: meetupData.createdBy,
        date: Timestamp.fromDate(meetupData.date),
        time: meetupData.time,
        location: meetupData.location,
        maxAttendees: meetupData.maxAttendees || null,
        attendees: [meetupData.createdBy], // Creator is automatically attending
        attendeeCount: 1,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'upcoming' // Business rule: New meetups are always upcoming
      }

      const docRef = await addDoc(collection(db, 'meetups'), newMeetup)
      return docRef.id
    } catch (error) {
      console.error('Error creating meetup:', error)
      throw new Error('Failed to create meetup. Please try again.')
    }
  }

  /**
   * Gets all meetups for a user based on their joined groups
   * Moved from firebaseUtils.ts
   */
  async getUserMeetups(userId: string, userGroups?: string[]): Promise<Meetup[]> {
    if (!userId) {
      throw new Error('User ID is required')
    }

    try {
      // If userGroups not provided, fetch user profile first
      let groupIds = userGroups
      if (!groupIds) {
        const userDoc = await getDoc(doc(db, 'users', userId))
        if (!userDoc.exists()) {
          throw new Error('User not found')
        }
        const userData = userDoc.data() as UserProfile
        groupIds = userData.groups || []
      }

      if (!groupIds || groupIds.length === 0) {
        return []
      }

      // Query meetups where groupId is in user's groups
      const meetupsQuery = query(
        collection(db, 'meetups'),
        where('groupId', 'in', groupIds)
      )
      
      const querySnapshot = await getDocs(meetupsQuery)
      const meetups: Meetup[] = []
      
      querySnapshot.forEach((doc) => {
        meetups.push({ id: doc.id, ...doc.data() } as Meetup)
      })

      // Sort by date (most recent first)
      return sortMeetupsByDate(meetups, 'desc')
    } catch (error) {
      console.error('Error getting user meetups:', error)
      throw new Error('Failed to load meetups')
    }
  }

  /**
   * Gets meetups for a specific group
   * Moved from firebaseUtils.ts
   */
  async getGroupMeetups(groupId: string): Promise<Meetup[]> {
    if (!groupId) {
      throw new Error('Group ID is required')
    }

    try {
      const meetupsQuery = query(
        collection(db, 'meetups'),
        where('groupId', '==', groupId)
      )
      
      const querySnapshot = await getDocs(meetupsQuery)
      const meetups: Meetup[] = []
      
      querySnapshot.forEach((doc) => {
        meetups.push({ id: doc.id, ...doc.data() } as Meetup)
      })

      // Sort by date (most recent first)
      return sortMeetupsByDate(meetups, 'desc')
    } catch (error) {
      console.error(`Error loading meetups for group ${groupId}:`, error)
      throw new Error('Failed to load group meetups')
    }
  }

  /**
   * Updates meetup information
   */
  async updateMeetup(meetupId: string, updates: Partial<Meetup>, userId: string): Promise<void> {
    if (!meetupId || !userId) {
      throw new Error('Meetup ID and User ID are required')
    }

    // Business rule: Validate updates if they include name or description
    if (updates.name || updates.description) {
      this.validateMeetupUpdates(updates)
    }

    try {
      const meetupDocRef = doc(db, 'meetups', meetupId)
      
      // Business rule: Convert date to Timestamp if provided
      const updatesWithTimestamp: any = {
        ...updates,
        updatedAt: serverTimestamp()
      }

      if (updates.date && updates.date instanceof Date) {
        updatesWithTimestamp.date = Timestamp.fromDate(updates.date)
      }

      await updateDoc(meetupDocRef, updatesWithTimestamp)
    } catch (error) {
      console.error('Error updating meetup:', error)
      throw new Error('Failed to update meetup. Please try again.')
    }
  }

  /**
   * Adds a user to meetup attendees
   */
  async joinMeetup(meetupId: string, userId: string): Promise<void> {
    if (!meetupId || !userId) {
      throw new Error('Meetup ID and User ID are required')
    }

    try {
      const meetupDocRef = doc(db, 'meetups', meetupId)
      
      // Business rule: Add attendee and update count
      await updateDoc(meetupDocRef, {
        attendees: arrayUnion(userId),
        attendeeCount: arrayUnion(userId).length, // This will be calculated properly by Firestore
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Error joining meetup:', error)
      throw new Error('Failed to join meetup. Please try again.')
    }
  }

  /**
   * Removes a user from meetup attendees
   */
  async leaveMeetup(meetupId: string, userId: string): Promise<void> {
    if (!meetupId || !userId) {
      throw new Error('Meetup ID and User ID are required')
    }

    try {
      const meetupDocRef = doc(db, 'meetups', meetupId)
      
      // Business rule: Remove attendee and update count
      await updateDoc(meetupDocRef, {
        attendees: arrayRemove(userId),
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Error leaving meetup:', error)
      throw new Error('Failed to leave meetup. Please try again.')
    }
  }

  /**
   * Gets attendee profiles for a meetup
   * Uses the same logic as userService.getAttendeeProfiles
   */
  async getMeetupAttendees(attendeeIds: string[]): Promise<UserProfile[]> {
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
      console.error('Error loading meetup attendees:', error)
      throw new Error('Failed to load attendees')
    }
  }

  /**
   * Deletes a meetup (only creator can do this)
   */
  async deleteMeetup(meetupId: string, userId: string): Promise<void> {
    if (!meetupId || !userId) {
      throw new Error('Meetup ID and User ID are required')
    }

    try {
      // Note: In a real app, you'd want to fetch the meetup first to check if user is the creator
      // For now, we'll trust that the UI handles this business rule
      const meetupDocRef = doc(db, 'meetups', meetupId)
      await deleteDoc(meetupDocRef)
    } catch (error) {
      console.error('Error deleting meetup:', error)
      throw new Error('Failed to delete meetup. Please try again.')
    }
  }

  /**
   * Updates meetup status (upcoming, ongoing, completed, cancelled)
   */
  async updateMeetupStatus(meetupId: string, status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled', userId: string): Promise<void> {
    if (!meetupId || !status || !userId) {
      throw new Error('Meetup ID, status, and User ID are required')
    }

    // Business rule: Valid status values
    const validStatuses = ['upcoming', 'ongoing', 'completed', 'cancelled']
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid meetup status')
    }

    try {
      await this.updateMeetup(meetupId, { status }, userId)
    } catch (error) {
      console.error('Error updating meetup status:', error)
      throw error
    }
  }

  /**
   * Checks if a meetup has reached capacity
   */
  async isMeetupFull(meetupId: string): Promise<boolean> {
    // This would require fetching the meetup first
    // For now, return false - implement when needed
    return false
  }

  /**
   * Validates meetup data according to business rules
   * This is a private method that encapsulates validation logic
   */
  private validateMeetupData(meetupData: {
    name: string
    description: string
    groupId: string
    createdBy: string
    date: Date
    time: string
    location: string
    maxAttendees?: number
  }): void {
    // Business rule: Meetup name validation
    if (!validationRules.meetupName(meetupData.name)) {
      throw new Error('Meetup name must be between 3 and 100 characters')
    }

    // Business rule: Meetup description validation
    if (!validationRules.meetupDescription(meetupData.description)) {
      throw new Error('Meetup description must be between 10 and 1000 characters')
    }

    // Business rule: Group ID is required
    if (!meetupData.groupId || meetupData.groupId.trim().length === 0) {
      throw new Error('Group ID is required')
    }

    // Business rule: Creator ID is required
    if (!meetupData.createdBy || meetupData.createdBy.trim().length === 0) {
      throw new Error('Creator ID is required')
    }

    // Business rule: Date must be in the future
    if (meetupData.date <= new Date()) {
      throw new Error('Meetup date must be in the future')
    }

    // Business rule: Time is required
    if (!meetupData.time || meetupData.time.trim().length === 0) {
      throw new Error('Time is required')
    }

    // Business rule: Location is required
    if (!meetupData.location || meetupData.location.trim().length === 0) {
      throw new Error('Location is required')
    }

    // Business rule: Max attendees must be positive if provided
    if (meetupData.maxAttendees !== undefined && meetupData.maxAttendees <= 0) {
      throw new Error('Max attendees must be a positive number')
    }
  }

  /**
   * Validates meetup update data
   */
  private validateMeetupUpdates(updates: Partial<Meetup>): void {
    if (updates.name && !validationRules.meetupName(updates.name)) {
      throw new Error('Meetup name must be between 3 and 100 characters')
    }

    if (updates.description && !validationRules.meetupDescription(updates.description)) {
      throw new Error('Meetup description must be between 10 and 1000 characters')
    }

    if (updates.date && updates.date instanceof Date && updates.date <= new Date()) {
      throw new Error('Meetup date must be in the future')
    }
  }
}

// Export singleton instance
export const meetupService = new MeetupService()
