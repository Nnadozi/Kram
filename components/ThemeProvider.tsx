import { useThemeStore } from '@/stores/themeStore'
import { StatusBar } from 'expo-status-bar'
import * as SystemUI from 'expo-system-ui'
import { useEffect, useState } from 'react'
import { Platform, useColorScheme, View } from 'react-native'
import { PaperProvider } from 'react-native-paper'

interface ThemeProviderProps {
  children: React.ReactNode
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  const { getCurrentTheme, primaryColor, appearanceMode } = useThemeStore()
  const [currentTheme, setCurrentTheme] = useState(getCurrentTheme(isDark))

  // Update theme when color scheme changes, primary color changes, or appearance mode changes
  useEffect(() => {
    setCurrentTheme(getCurrentTheme(isDark))
  }, [isDark, primaryColor, appearanceMode, getCurrentTheme])

  // Update system UI colors when theme changes
  useEffect(() => {
    if (Platform.OS === 'android') {
      SystemUI.setBackgroundColorAsync(currentTheme.colors.background)
    }
  }, [currentTheme.colors.background])

  // Determine status bar style based on current theme
  const statusBarStyle = (() => {
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
        shouldUseDark = isDark
        break
    }
    
    return shouldUseDark ? 'light' : 'dark'
  })()

  return (
    <PaperProvider theme={currentTheme}>
      <StatusBar style={statusBarStyle} />
      <View style={{ flex: 1, backgroundColor: currentTheme.colors.background }}>
        {children}
      </View>
    </PaperProvider>
  )
}

export default ThemeProvider

// DONE!
