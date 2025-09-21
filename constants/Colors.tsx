import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

// Helper function to generate theme colors based on a primary color
const generateThemeColors = (primaryColor: string, isDark: boolean = false) => {
  // Convert hex to RGB if needed
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Convert rgb string to RGB object
  const parseRgbString = (rgb: string) => {
    const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    return match ? {
      r: parseInt(match[1]),
      g: parseInt(match[2]),
      b: parseInt(match[3])
    } : null;
  };

  // Get RGB values
  let rgb = parseRgbString(primaryColor);
  if (!rgb && primaryColor.startsWith('#')) {
    rgb = hexToRgb(primaryColor);
  }
  
  if (!rgb) {
    // Fallback to default orange
    rgb = { r: 255, g: 152, b: 0 };
  }

  // Generate lighter and darker variants
  const lighten = (r: number, g: number, b: number, factor: number) => ({
    r: Math.min(255, Math.round(r + (255 - r) * factor)),
    g: Math.min(255, Math.round(g + (255 - g) * factor)),
    b: Math.min(255, Math.round(b + (255 - b) * factor))
  });

  const darken = (r: number, g: number, b: number, factor: number) => ({
    r: Math.max(0, Math.round(r * (1 - factor))),
    g: Math.max(0, Math.round(g * (1 - factor))),
    b: Math.max(0, Math.round(b * (1 - factor)))
  });

  // Generate color variants
  const primaryLight = lighten(rgb.r, rgb.g, rgb.b, 0.3);
  const primaryDark = darken(rgb.r, rgb.g, rgb.b, 0.2);
  const primaryContainer = lighten(rgb.r, rgb.g, rgb.b, 0.7);
  const primaryContainerDark = darken(rgb.r, rgb.g, rgb.b, 0.4);

  // Convert back to RGB strings
  const toRgbString = (color: { r: number; g: number; b: number }) => 
    `rgb(${color.r}, ${color.g}, ${color.b})`;

  return {
    primary: toRgbString(rgb),
    onPrimary: 'rgb(255, 255, 255)',
    primaryContainer: isDark ? toRgbString(primaryContainerDark) : toRgbString(primaryContainer),
    onPrimaryContainer: isDark ? toRgbString(primaryLight) : toRgbString(primaryDark),
    
    // Secondary - lighter shade
    secondary: toRgbString(lighten(rgb.r, rgb.g, rgb.b, 0.1)),
    onSecondary: 'rgb(255, 255, 255)',
    secondaryContainer: isDark ? toRgbString(darken(rgb.r, rgb.g, rgb.b, 0.3)) : toRgbString(lighten(rgb.r, rgb.g, rgb.b, 0.8)),
    onSecondaryContainer: isDark ? toRgbString(lighten(rgb.r, rgb.g, rgb.b, 0.2)) : toRgbString(darken(rgb.r, rgb.g, rgb.b, 0.3)),
    
    // Tertiary - darker shade
    tertiary: toRgbString(darken(rgb.r, rgb.g, rgb.b, 0.1)),
    onTertiary: 'rgb(255, 255, 255)',
    tertiaryContainer: isDark ? toRgbString(darken(rgb.r, rgb.g, rgb.b, 0.5)) : toRgbString(lighten(rgb.r, rgb.g, rgb.b, 0.6)),
    onTertiaryContainer: isDark ? toRgbString(lighten(rgb.r, rgb.g, rgb.b, 0.3)) : toRgbString(darken(rgb.r, rgb.g, rgb.b, 0.4)),
  };
};

// Default colors (fallback)
const DEFAULT_PRIMARY = 'rgb(255, 152, 0)'; // Orange 500

export const createCustomLightTheme = (primaryColor?: string) => {
  const colors = primaryColor ? generateThemeColors(primaryColor, false) : {
    // Primary orange theme (default)
    primary: DEFAULT_PRIMARY,
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
  };

  return {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      ...colors,
      
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
};

export const createCustomDarkTheme = (primaryColor?: string) => {
  const colors = primaryColor ? generateThemeColors(primaryColor, true) : {
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
  };

  return {
    ...MD3DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      ...colors,
      
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
};

// Export default themes for backward compatibility
export const CustomLightTheme = createCustomLightTheme();
export const CustomDarkTheme = createCustomDarkTheme();