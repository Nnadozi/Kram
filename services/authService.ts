import { auth, db } from '@/firebase/firebaseConfig'
import { getFirebaseErrorMessage } from '@/util/firebaseErrors'
import { validationRules } from '@/util/validation'
import {
  createUserWithEmailAndPassword,
  deleteUser,
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
  User
} from 'firebase/auth'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'

/**
 * Authentication service handles all business logic related to user authentication
 * This includes sign up, sign in, sign out, and user creation workflows
 */
export class AuthService {
  
  /**
   * Signs up a new user with email and password
   * Handles validation, account creation, and initial user document creation
   */
  async signUp(email: string, password: string): Promise<User> {
    // Business rule: Validate email format
    if (!validationRules.email(email)) {
      throw new Error('Please enter a valid email address')
    }

    // Business rule: Validate password strength
    if (!validationRules.password(password)) {
      throw new Error('Password must be at least 8 characters long')
    }

    try {
      // Create Firebase Auth account
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      
      // Business rule: Create initial user document in Firestore
      await this.createInitialUserDocument(user)
      
      return user
    } catch (error) {
      // Convert Firebase errors to user-friendly messages
      const errorMessage = getFirebaseErrorMessage(error)
      throw new Error(errorMessage)
    }
  }

  /**
   * Signs in an existing user with email and password
   */
  async signIn(email: string, password: string): Promise<User> {
    // Business rule: Validate email format
    if (!validationRules.email(email)) {
      throw new Error('Please enter a valid email address')
    }

    // Business rule: Password is required
    if (!validationRules.password(password)) {
      throw new Error('Please enter a valid password')
    }

    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password)
      return user
    } catch (error) {
      // Convert Firebase errors to user-friendly messages
      const errorMessage = getFirebaseErrorMessage(error)
      throw new Error(errorMessage)
    }
  }

  /**
   * Signs out the current user
   */
  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth)
    } catch (error) {
      console.error('Error signing out:', error)
      throw new Error('Failed to sign out. Please try again.')
    }
  }

  /**
   * Deletes the current user's Firebase Auth account
   * This should be called after cleaning up user data in Firestore
   */
  async deleteAccount(): Promise<void> {
    try {
      const user = auth.currentUser
      if (!user) {
        throw new Error('No authenticated user found')
      }

      await deleteUser(user)
    } catch (error) {
      console.error('Error deleting account:', error)
      const errorMessage = getFirebaseErrorMessage(error)
      throw new Error(errorMessage)
    }
  }

  /**
   * Creates the initial user document in Firestore after successful signup
   * This is a private method that encapsulates the business rules for new user setup
   */
  private async createInitialUserDocument(user: User): Promise<void> {
    const userDocRef = doc(db, 'users', user.uid)
    
    // Business rule: Initial user document structure
    const initialUserData = {
      uid: user.uid,
      email: user.email,
      onboardingComplete: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      authType: 'email-password',
    }

    await setDoc(userDocRef, initialUserData)
  }
}

// Export singleton instance
export const authService = new AuthService()
