import { auth } from '@/firebase/firebaseConfig'
import { authService } from '@/services/authService'
import { userService } from '@/services/userService'
import { UserProfile } from '@/types/UserProfile'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import { User, deleteUser, onAuthStateChanged } from 'firebase/auth'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { useThemeStore } from './themeStore'

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
  getCurrentPrimaryColor: () => string
  initializeUserProfile: (profile: UserProfile) => void
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
          // Use authService instead of direct Firebase calls
          await authService.signOut()
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
          
          // Use userService to delete user document
          await userService.deleteUserDocument(user.uid)
          console.log('User document deleted from Firestore')
          
          // Delete from Firebase Auth (this still needs to be direct)
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
        
        // Initialize theme with user's avatar color if user is signed in
        if (user) {
          // This will be called after userProfile is loaded
        } else {
          // Reset to default theme when user signs out
          useThemeStore.getState().updateTheme('rgb(255, 152, 0)')
        }
      },
      setUserProfile: (profile: Partial<UserProfile> | null) => {
        if (profile === null) {
          set({ userProfile: null })
          return
        }
        
        // Update local state first for immediate UI response
        const currentState = get()
        const updatedProfile = { ...currentState.userProfile, ...profile } as UserProfile      
        set({ 
          userProfile: updatedProfile,
        })
        
        // Update theme if avatar color changed
        if (profile.avatar && profile.avatar !== currentState.userProfile?.avatar) {
          useThemeStore.getState().updateTheme(profile.avatar)
        }
        
        // Update in Firestore using userService
        const user = currentState.authUser
        if (user && profile) {
          userService.updateUserProfile(user.uid, profile).then(() => {
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
      },
      getCurrentPrimaryColor: () => {
        const state = get()
        return state.userProfile?.avatar || 'rgb(255, 152, 0)' // Default orange
      },
      initializeUserProfile: (profile: UserProfile) => {
        set({ userProfile: profile })
        // Initialize theme with user's avatar color
        if (profile.avatar) {
          useThemeStore.getState().updateTheme(profile.avatar)
        }
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