import { Profile } from "@/types/Profile";
import { User } from "firebase/auth";
import { create } from "zustand";

type AuthStore = {
    userObject: User | null;
    userProfile: Profile | null;
    isAuthenticated: boolean;
    loading: boolean;
    setUserObject: (user: User) => void;
    setUserProfile: (profile: Profile) => void;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
    setLoading: (loading: boolean) => void;
    logOut: () => void;
}

const useUserStore = create<AuthStore>((set) => ({
    userObject: null,
    userProfile: null,
    isAuthenticated: false,
    loading: false,
    setUserObject: (user: User) => set({ userObject: user }),
    setUserProfile: (profile: Profile) => set({ userProfile: profile }),
    setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
    setLoading: (loading: boolean) => set({ loading }),
    logOut: () => {
       
    }
})) 

export { useUserStore };
