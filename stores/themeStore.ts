import { createCustomDarkTheme, createCustomLightTheme } from '@/constants/Colors'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type AppearanceMode = 'light' | 'dark' | 'system'

interface ThemeState {
  primaryColor: string
  appearanceMode: AppearanceMode
  customLightTheme: typeof MD3LightTheme
  customDarkTheme: typeof MD3DarkTheme
  updateTheme: (primaryColor: string) => void
  updateAppearanceMode: (mode: AppearanceMode) => void
  getTheme: (isDark: boolean) => typeof MD3LightTheme | typeof MD3DarkTheme
  getCurrentTheme: (systemIsDark: boolean) => typeof MD3LightTheme | typeof MD3DarkTheme
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      primaryColor: 'rgb(255, 152, 0)', // Default orange
      appearanceMode: 'system', // Default to system
      customLightTheme: createCustomLightTheme('rgb(255, 152, 0)'),
      customDarkTheme: createCustomDarkTheme('rgb(255, 152, 0)'),
      
      updateTheme: (primaryColor: string) => {
        set({
          primaryColor,
          customLightTheme: createCustomLightTheme(primaryColor),
          customDarkTheme: createCustomDarkTheme(primaryColor),
        })
      },
      
      updateAppearanceMode: (mode: AppearanceMode) => {
        set({ appearanceMode: mode })
      },
      
      getTheme: (isDark: boolean) => {
        const state = get()
        return isDark ? state.customDarkTheme : state.customLightTheme
      },
      
      getCurrentTheme: (systemIsDark: boolean) => {
        const state = get()
        const { appearanceMode } = state
        
        // Determine which theme to use based on appearance mode
        let shouldUseDark: boolean
        switch (appearanceMode) {
          case 'light':
            shouldUseDark = false
            break
          case 'dark':
            shouldUseDark = true
            break
          case 'system':
          default:
            shouldUseDark = systemIsDark
            break
        }
        
        return state.getTheme(shouldUseDark)
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        primaryColor: state.primaryColor,
        appearanceMode: state.appearanceMode,
        customLightTheme: state.customLightTheme,
        customDarkTheme: state.customDarkTheme,
      }),
    }
  )
)

// DONE!
