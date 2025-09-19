import { Timestamp } from 'firebase/firestore'

/**
 * Formats a date for display (handles both Firestore Timestamps and Date objects)
 */
export const formatMeetupDate = (date: any): string => {
  if (!date) return 'No date'
  
  try {
    const dateObj = date.toDate ? date.toDate() : new Date(date)
    return dateObj.toLocaleDateString()
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Invalid date'
  }
}

/**
 * Formats a time for display (handles both Firestore Timestamps and Date objects)
 */
export const formatMeetupTime = (time: any): string => {
  if (!time) return 'No time'
  
  try {
    const timeObj = time.toDate ? time.toDate() : new Date(time)
    return timeObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } catch (error) {
    console.error('Error formatting time:', error)
    return 'Invalid time'
  }
}

/**
 * Formats a date and time together for display
 */
export const formatDateTime = (timestamp: any): string => {
  if (!timestamp) return 'TBD'
  
  try {
    const dateObj = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return dateObj.toLocaleString()
  } catch (error) {
    console.error('Error formatting datetime:', error)
    return 'Invalid datetime'
  }
}

/**
 * Formats duration in minutes to human-readable format (e.g., "1h 30m", "45m")
 */
export const formatDuration = (minutes: number): string => {
  if (!minutes || minutes <= 0) return '0m'
  
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  
  if (hours > 0) {
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }
  
  return `${mins}m`
}

/**
 * Formats a creation date (handles Date objects and Firestore Timestamps)
 */
export const formatCreatedAt = (createdAt: any): string => {
  if (!createdAt) return 'Unknown'
  
  try {
    if (createdAt instanceof Date) {
      return createdAt.toLocaleDateString()
    } else if (createdAt instanceof Timestamp) {
      return createdAt.toDate().toLocaleDateString()
    } else if (createdAt.toDate) {
      return createdAt.toDate().toLocaleDateString()
    }
    return 'Unknown'
  } catch (error) {
    console.error('Error formatting created date:', error)
    return 'Unknown'
  }
}

/**
 * Determines if a meetup is upcoming, past, or happening now
 */
export const getMeetupStatus = (meetup: { date: any, cancelled?: boolean }): 'upcoming' | 'past' | 'now' | 'cancelled' => {
  if (meetup.cancelled) return 'cancelled'
  
  try {
    const meetupDate = meetup.date?.toDate ? meetup.date.toDate() : new Date(meetup.date)
    const now = new Date()
    
    // Consider "now" as within 1 hour of the meetup time
    const oneHour = 60 * 60 * 1000
    const timeDiff = meetupDate.getTime() - now.getTime()
    
    if (Math.abs(timeDiff) <= oneHour) return 'now'
    if (meetupDate > now) return 'upcoming'
    return 'past'
  } catch (error) {
    console.error('Error determining meetup status:', error)
    return 'past'
  }
}

/**
 * Sorts meetups by date (most recent first by default)
 */
export const sortMeetupsByDate = <T extends { date: any }>(
  meetups: T[], 
  direction: 'asc' | 'desc' = 'desc'
): T[] => {
  return [...meetups].sort((a, b) => {
    try {
      const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date)
      const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date)
      
      const diff = dateB.getTime() - dateA.getTime()
      return direction === 'desc' ? diff : -diff
    } catch (error) {
      console.error('Error sorting meetups by date:', error)
      return 0
    }
  })
}

/**
 * Checks if a date is today
 */
export const isToday = (date: any): boolean => {
  try {
    const dateObj = date?.toDate ? date.toDate() : new Date(date)
    const today = new Date()
    
    return dateObj.toDateString() === today.toDateString()
  } catch (error) {
    return false
  }
}

/**
 * Checks if a date is within the next week
 */
export const isThisWeek = (date: any): boolean => {
  try {
    const dateObj = date?.toDate ? date.toDate() : new Date(date)
    const now = new Date()
    const oneWeek = 7 * 24 * 60 * 60 * 1000
    
    return dateObj.getTime() - now.getTime() <= oneWeek && dateObj > now
  } catch (error) {
    return false
  }
}
