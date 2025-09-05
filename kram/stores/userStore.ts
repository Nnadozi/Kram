import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from 'firebase/auth'
import { UserProfile } from '@/types/UserProfile'

interface UserState {
  authUser: User | null
  isAuthenticated: boolean
  isLoading: boolean 
  userProfile: UserProfile | null
  isOnboardingComplete: boolean
  isProfileComplete: boolean
  signOut: () => void
  deleteAccount: () => void 
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      authUser: null,
      isAuthenticated: false,
      isLoading: true,
      userProfile: null,
      isOnboardingComplete: false,
      isProfileComplete: false,
      signOut: () => {},
      deleteAccount: () => {}
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        authUser: state.authUser,
        isAuthenticated: state.isAuthenticated,
        userProfile: state.userProfile,
        isProfileComplete: state.isProfileComplete,
        isOnboardingComplete: state.isOnboardingComplete
      })
    }
  )
)

// Selectors for better performance
export const useAuthUser = () => useUserStore(state => state.authUser)
export const useIsAuthenticated = () => useUserStore(state => state.isAuthenticated)
export const useIsLoading = () => useUserStore(state => state.isLoading)
export const useUserProfile = () => useUserStore(state => state.userProfile)
export const useIsProfileComplete = () => useUserStore(state => state.isProfileComplete)
