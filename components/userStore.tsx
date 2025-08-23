import { db } from "@/firebase/firebaseConfig";
import { Profile } from "@/types/Profile";
import { User } from "firebase/auth";
import { doc, getDoc, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { create } from "zustand";

type UserStore = {
    userObject: User | null;
    userProfile: Profile | null;
    isOnboarded: boolean;
    isAuthenticated: boolean;
    loading: boolean;
    setUserObject: (user: User) => void;
    setUserProfile: (profile: Profile) => void;
    setIsOnboarded: (isOnboarded: boolean) => void;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
    setLoading: (loading: boolean) => void;
    logOut: () => void;
}

const useUserStore = create<UserStore>((set) => ({
    userObject: null,
    userProfile: null,
    isOnboarded: false,
    isAuthenticated: false,
    loading: false,
    setUserObject: (user: User) =>{
        console.log('setting user object', user)
        set({ 
            userObject: user
        })
    },
    setUserProfile: async (profile: Profile) =>{
        console.log('setting user profile', profile)
        set({ userProfile: profile })
        const docRef = doc(db, 'users', profile.uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) { 
            await updateDoc(docRef, {
                ...profile,
                updatedAt: Timestamp.now(),
            })
        } else { 
            await setDoc(docRef, {
                ...profile,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
            })
        }
    },
    setIsOnboarded: (isOnboarded: boolean) =>{
        console.log('setting is onboarded', isOnboarded)
        set({ isOnboarded })
    },
    setIsAuthenticated: (isAuthenticated: boolean) =>{
        console.log('setting is authenticated', isAuthenticated)
        set({ isAuthenticated })
    },
    setLoading: (loading: boolean) =>{
        console.log('setting loading', loading)
        set({ loading })
    },
    logOut: () => {
        console.log('logging out')
        set({ userObject: null, userProfile: null, isOnboarded: false, isAuthenticated: false, loading: false })
    }
})) 

export { useUserStore };
