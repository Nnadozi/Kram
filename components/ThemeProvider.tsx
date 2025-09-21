import { useThemeStore } from '@/stores/themeStore'
import { useEffect, useState } from 'react'
import { useColorScheme } from 'react-native'
import { PaperProvider } from 'react-native-paper'

interface ThemeProviderProps {
  children: React.ReactNode
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  const { getTheme, primaryColor } = useThemeStore()
  const [currentTheme, setCurrentTheme] = useState(getTheme(isDark))

  // Update theme when color scheme changes or primary color changes
  useEffect(() => {
    setCurrentTheme(getTheme(isDark))
  }, [isDark, primaryColor, getTheme])

  return (
    <PaperProvider theme={currentTheme}>
      {children}
    </PaperProvider>
  )
}

export default ThemeProvider

// DONE!
