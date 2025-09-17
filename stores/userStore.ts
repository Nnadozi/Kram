import { auth, db } from '@/firebase/firebaseConfig'
import { UserProfile } from '@/types/UserProfile'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import { User, deleteUser, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth'
import { deleteDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface UserState {
  authUser: User | null
  isAuthenticated: boolean
  isLoading: boolean
  authError: string | null
  userProfile: UserProfile | null
  signOut: () => Promise<void>
  deleteAccount: () => Promise<void>
  setAuthUser: (user: User | null) => void
  setUserProfile: (profile: Partial<UserProfile> | null) => void
  initializeAuth: () => void
  clearError: () => void
  setLoading: (loading: boolean) => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      authUser: null,
      isAuthenticated: false,
      isLoading: true,
      authError: null,
      userProfile: null,
      signOut: async () => {
        try {
          set({ isLoading: true, authError: null })
          await firebaseSignOut(auth)
          set({
            authUser: null,
            isAuthenticated: false,
            isLoading: false,
            userProfile: null,
            authError: null,
          })
          console.log('User signed out successfully')
          router.replace('/(onboarding)')
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to sign out'
          set({ 
            isLoading: false, 
            authError: errorMessage 
          })
          console.error('Error signing out:', error)
        }
      },
      deleteAccount: async () => {
        try {
          set({ isLoading: true, authError: null })
          const currentState = get()
          const user = currentState.authUser
          
          if (!user) {
            set({ 
              isLoading: false, 
              authError: 'No user to delete' 
            })
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
            authError: null,
          })
          router.replace('/(onboarding)')
          console.log('Account deleted successfully')
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to delete account'
          set({ 
            isLoading: false, 
            authError: errorMessage 
          })
          console.error('Error deleting account:', error)
        }
      },
      setAuthUser: (user: User | null) => {
        console.log('Auth state changed:', user ? 'User signed in' : 'User signed out')
        set({ 
          authUser: user, 
          isAuthenticated: !!user,
          isLoading: false,
          authError: null
        })
      },
      setUserProfile: (profile: Partial<UserProfile> | null) => {
      
        
        // update user profile in firestore and local state
        const currentState = get()
        const updatedProfile = { ...currentState.userProfile, ...profile } as UserProfile      
        set({ 
          userProfile: updatedProfile,
        })
        const user = currentState.authUser
        if (user) {
          const userDocRef = doc(db, 'users', user.uid)
          const profileWithTimestamp = { ...profile, updatedAt: serverTimestamp() }
          updateDoc(userDocRef, profileWithTimestamp).then(() => {
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
          userProfile: null,
          authError: null
        })
      },
      clearError: () => {
        set({ authError: null })
      },
      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      }
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
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
export const useAuthError = () => useUserStore(state => state.authError)
export const useUserProfile = () => useUserStore(state => state.userProfile)

export const setupAuthListener = () => {
  const { setAuthUser, setLoading } = useUserStore.getState()
  
  return onAuthStateChanged(auth, (user) => {
    setLoading(false)
    setAuthUser(user)
  })
}