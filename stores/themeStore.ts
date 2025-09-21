import { createCustomDarkTheme, createCustomLightTheme } from '@/constants/Colors'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface ThemeState {
  primaryColor: string
  customLightTheme: typeof MD3LightTheme
  customDarkTheme: typeof MD3DarkTheme
  updateTheme: (primaryColor: string) => void
  getTheme: (isDark: boolean) => typeof MD3LightTheme | typeof MD3DarkTheme
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      primaryColor: 'rgb(255, 152, 0)', // Default orange
      customLightTheme: createCustomLightTheme('rgb(255, 152, 0)'),
      customDarkTheme: createCustomDarkTheme('rgb(255, 152, 0)'),
      
      updateTheme: (primaryColor: string) => {
        set({
          primaryColor,
          customLightTheme: createCustomLightTheme(primaryColor),
          customDarkTheme: createCustomDarkTheme(primaryColor),
        })
      },
      
      getTheme: (isDark: boolean) => {
        const state = get()
        return isDark ? state.customDarkTheme : state.customLightTheme
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        primaryColor: state.primaryColor,
        customLightTheme: state.customLightTheme,
        customDarkTheme: state.customDarkTheme,
      }),
    }
  )
)

// DONE!
