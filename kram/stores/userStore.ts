import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, signOut as firebaseSignOut, deleteUser } from 'firebase/auth'
import { UserProfile } from '@/types/UserProfile'
import { auth } from '@/firebase/firebaseConfig'
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/firebase/firebaseConfig'
import { router } from 'expo-router'

interface UserState {
  authUser: User | null
  isAuthenticated: boolean
  isLoading: boolean 
  userProfile: UserProfile | null
  signOut: () => void
  deleteAccount: () => void 
  setAuthUser: (user: User) => void
  setUserProfile: (profile: Partial<UserProfile>) => void
  initializeAuth: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      authUser: null,
      isAuthenticated: false,
      isLoading: true,
      userProfile: null,
      signOut: async () => {
        try {
          await firebaseSignOut(auth)
          set({
            authUser: null,
            isAuthenticated: false,
            isLoading: false,
            userProfile: null,
          })
          console.log('User signed out successfully')
          router.replace('/(auth)/Signin')
        } catch (error) {
          console.error('Error signing out:', error)
        }
      },
      deleteAccount: async () => {
        try {
          const currentState = get()
          const user = currentState.authUser
          
          if (!user) {
            console.error('No user to delete')
            return
          }
          const userDocRef = doc(db, 'users', user.uid)
          await deleteDoc(userDocRef)
          console.log('User document deleted from Firestore')
          await deleteUser(user)
          console.log('User deleted from Firebase Auth')
          set({
            authUser: null,
            isAuthenticated: false,
            isLoading: false,
            userProfile: null,
          })
          router.replace('/(onboarding)')
          console.log('Account deleted successfully')
        } catch (error) {
          console.error('Error deleting account:', error)
        }
      },
      setAuthUser: (user: User) => {
        console.log('signing in user', user)
        set({ 
          authUser: user, 
          isAuthenticated: true,
          isLoading: false 
        })
      },
      setUserProfile: (profile: Partial<UserProfile>) => {
        const currentState = get()
        const updatedProfile = { ...currentState.userProfile, ...profile } as UserProfile      
        set({ 
          userProfile: updatedProfile,
        })
        const user = currentState.authUser
        if (user) {
          const userDocRef = doc(db, 'users', user.uid)
          updateDoc(userDocRef, profile).then(() => {
            console.log('user profile updated successfully', profile)
          }).catch((error) => {
            console.error('error updating user profile', error)
          })
        } 
      },
      initializeAuth: () => {
        set({ 
          authUser: null, 
          isAuthenticated: false,
          isLoading: false,
          userProfile: null 
        })
      }
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        authUser: state.authUser,
        isAuthenticated: state.isAuthenticated,
        userProfile: state.userProfile,
      })
    }
  )
)

export const useAuthUser = () => useUserStore(state => state.authUser)
export const useIsAuthenticated = () => useUserStore(state => state.isAuthenticated)
export const useIsLoading = () => useUserStore(state => state.isLoading)
export const useUserProfile = () => useUserStore(state => state.userProfile)
