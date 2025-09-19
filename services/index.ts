/**
 * Service Layer Index
 * 
 * This file exports all services for easy importing throughout the app.
 * Services contain business logic and handle data operations.
 */

export { authService } from './authService'
export { groupService } from './groupService'
export { meetupService } from './meetupService'
export { userService } from './userService'

// Export service types for components that need them
export type { AuthService } from './authService'
export type { GroupService } from './groupService'
export type { MeetupService } from './meetupService'
export type { UserService } from './userService'

