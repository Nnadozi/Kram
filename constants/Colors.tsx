import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

export const CustomLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    // Primary orange theme
    primary: 'rgb(255, 152, 0)', // Orange 500
    onPrimary: 'rgb(255, 255, 255)',
    primaryContainer: 'rgb(255, 224, 178)', // Light orange
    onPrimaryContainer: 'rgb(102, 60, 0)',
    
    // Secondary - lighter orange shade
    secondary: 'rgb(255, 193, 7)', // Amber 500 - lighter orange
    onSecondary: 'rgb(255, 255, 255)',
    secondaryContainer: 'rgb(255, 243, 186)', // Light amber
    onSecondaryContainer: 'rgb(102, 77, 0)',
    
    // Tertiary - darker orange shade
    tertiary: 'rgb(255, 111, 0)', // Orange 600 - darker orange
    onTertiary: 'rgb(255, 255, 255)',
    tertiaryContainer: 'rgb(255, 204, 153)', // Light dark orange
    onTertiaryContainer: 'rgb(122, 53, 0)',
    
    // Neutral colors
    background: 'rgb(255, 251, 254)',
    onBackground: 'rgb(28, 27, 31)',
    surface: 'rgb(255, 251, 254)',
    onSurface: 'rgb(28, 27, 31)',
    surfaceVariant: 'rgb(245, 245, 245)',
    onSurfaceVariant: 'rgb(66, 66, 66)',
    outline: 'rgb(121, 121, 121)',
    
    // Error colors
    error: 'rgb(186, 26, 26)',
    onError: 'rgb(255, 255, 255)',
    errorContainer: 'rgb(255, 218, 214)',
    onErrorContainer: 'rgb(65, 0, 2)',
    
    // Additional colors
    shadow: 'rgb(0, 0, 0)',
    inverseOnSurface: 'rgb(244, 239, 244)',
    inverseSurface: 'rgb(49, 48, 51)',
    inversePrimary: 'rgb(255, 183, 77)',
    backdrop: 'rgba(0, 0, 0, 0.4)',
    surfaceDisabled: 'rgba(28, 27, 31, 0.12)',
    onSurfaceDisabled: 'rgba(28, 27, 31, 0.38)',
  },
};

export const CustomDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    // Primary orange theme (darker for dark mode)
    primary: 'rgb(255, 183, 77)', // Lighter orange for dark mode
    onPrimary: 'rgb(102, 60, 0)',
    primaryContainer: 'rgb(143, 89, 0)', // Dark orange
    onPrimaryContainer: 'rgb(255, 224, 178)',
    
    // Secondary - lighter orange shade (dark mode)
    secondary: 'rgb(255, 213, 79)', // Lighter amber for dark mode
    onSecondary: 'rgb(102, 77, 0)',
    secondaryContainer: 'rgb(143, 107, 0)', // Dark amber
    onSecondaryContainer: 'rgb(255, 243, 186)',
    
    // Tertiary - darker orange shade (dark mode)
    tertiary: 'rgb(255, 152, 0)', // Orange 500 for dark mode
    onTertiary: 'rgb(122, 53, 0)',
    tertiaryContainer: 'rgb(175, 75, 0)', // Dark orange
    onTertiaryContainer: 'rgb(255, 204, 153)',
    
    // Neutral colors (dark mode) - Modern dark theme
    background: 'rgb(18, 18, 23)', // Dark blue-gray instead of pure black
    onBackground: 'rgb(245, 245, 245)', // Softer white
    surface: 'rgb(24, 24, 30)', // Slightly lighter than background
    onSurface: 'rgb(245, 245, 245)',
    surfaceVariant: 'rgb(40, 40, 47)', // Subtle elevation
    onSurfaceVariant: 'rgb(200, 200, 200)', // Softer gray text
    outline: 'rgb(100, 100, 100)', // More visible outlines
    
    // Error colors (dark mode)
    error: 'rgb(255, 180, 171)',
    onError: 'rgb(105, 0, 5)',
    errorContainer: 'rgb(147, 0, 10)',
    onErrorContainer: 'rgb(255, 218, 214)',
    
    // Additional colors (dark mode) - Modern styling
    shadow: 'rgba(0, 0, 0, 0.3)', // Softer shadows
    inverseOnSurface: 'rgb(40, 40, 47)',
    inverseSurface: 'rgb(245, 245, 245)',
    inversePrimary: 'rgb(255, 152, 0)',
    backdrop: 'rgba(0, 0, 0, 0.5)', // Slightly more opaque backdrop
    surfaceDisabled: 'rgba(245, 245, 245, 0.08)', // More subtle disabled state
    onSurfaceDisabled: 'rgba(245, 245, 245, 0.32)',
  },
};