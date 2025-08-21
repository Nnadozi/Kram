import { User } from "firebase/auth";
import { create } from "zustand";

type AuthStore = {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    setUser: (user: User) => void;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
    setLoading: (loading: boolean) => void;
    logOut: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    isAuthenticated: false,
    loading: false,
    setUser: (user: User) => set({ user }),
    setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
    setLoading: (loading: boolean) => set({ loading }),
    logOut: () => {
       
    }
})) 

export { useAuthStore };
