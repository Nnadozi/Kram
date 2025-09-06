import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from 'firebase/auth'
import { UserProfile } from '@/types/UserProfile'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase/firebaseConfig'

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
      signOut: () => {},
      deleteAccount: () => {},
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
