import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

// Custom Light Theme Colors
export const CustomLightColors = {
  primary: "rgb(33, 150, 243)", // modern blue
  onPrimary: "rgb(255, 255, 255)",
  primaryContainer: "rgb(227, 242, 253)",
  onPrimaryContainer: "rgb(0, 47, 108)",

  secondary: "rgb(97, 97, 97)", // neutral gray
  onSecondary: "rgb(255, 255, 255)",
  secondaryContainer: "rgb(238, 238, 238)",
  onSecondaryContainer: "rgb(33, 33, 33)",

  tertiary: "rgb(3, 155, 229)", // cyan accent
  onTertiary: "rgb(255, 255, 255)",
  tertiaryContainer: "rgb(224, 247, 250)",
  onTertiaryContainer: "rgb(0, 40, 50)",

  error: "rgb(211, 47, 47)",
  onError: "rgb(255, 255, 255)",
  errorContainer: "rgb(255, 205, 210)",
  onErrorContainer: "rgb(65, 0, 2)",

  background: "rgb(250, 250, 250)", // clean white
  onBackground: "rgb(28, 28, 30)",

  surface: "rgb(255, 255, 255)",
  onSurface: "rgb(28, 28, 30)",
  surfaceVariant: "rgb(245, 245, 245)",
  onSurfaceVariant: "rgb(97, 97, 97)",

  outline: "rgb(189, 189, 189)",
  outlineVariant: "rgb(224, 224, 224)",
  shadow: "rgb(0, 0, 0)",
  scrim: "rgb(0, 0, 0)",

  inverseSurface: "rgb(48, 48, 52)",
  inverseOnSurface: "rgb(240, 240, 240)",
  inversePrimary: "rgb(100, 181, 246)",

  elevation: {
    level0: "transparent",
    level1: "rgb(248, 248, 248)",
    level2: "rgb(244, 244, 244)",
    level3: "rgb(240, 240, 240)",
    level4: "rgb(238, 238, 238)",
    level5: "rgb(236, 236, 236)"
  },

  surfaceDisabled: "rgba(28, 28, 30, 0.12)",
  onSurfaceDisabled: "rgba(28, 28, 30, 0.38)",
  backdrop: "rgba(50, 50, 50, 0.4)"
};

// Custom Dark Theme Colors
export const CustomDarkColors = {
  primary: "rgb(100, 181, 246)", // lighter blue for dark mode
  onPrimary: "rgb(0, 37, 84)",
  primaryContainer: "rgb(21, 101, 192)",
  onPrimaryContainer: "rgb(227, 242, 253)",

  secondary: "rgb(189, 189, 189)",
  onSecondary: "rgb(33, 33, 33)",
  secondaryContainer: "rgb(66, 66, 66)",
  onSecondaryContainer: "rgb(238, 238, 238)",

  tertiary: "rgb(129, 212, 250)",
  onTertiary: "rgb(0, 30, 40)",
  tertiaryContainer: "rgb(0, 96, 100)",
  onTertiaryContainer: "rgb(224, 247, 250)",

  error: "rgb(239, 83, 80)",
  onError: "rgb(33, 0, 2)",
  errorContainer: "rgb(139, 0, 10)",
  onErrorContainer: "rgb(255, 180, 171)",

  background: "rgb(18, 18, 18)", // sleek dark
  onBackground: "rgb(230, 230, 230)",

  surface: "rgb(24, 24, 24)",
  onSurface: "rgb(230, 230, 230)",
  surfaceVariant: "rgb(50, 50, 50)",
  onSurfaceVariant: "rgb(189, 189, 189)",

  outline: "rgb(97, 97, 97)",
  outlineVariant: "rgb(50, 50, 50)",

  shadow: "rgb(0, 0, 0)",
  scrim: "rgb(0, 0, 0)",

  inverseSurface: "rgb(230, 230, 230)",
  inverseOnSurface: "rgb(24, 24, 24)",
  inversePrimary: "rgb(33, 150, 243)",

  elevation: {
    level0: "transparent",
    level1: "rgb(33, 33, 33)",
    level2: "rgb(40, 40, 40)",
    level3: "rgb(46, 46, 46)",
    level4: "rgb(52, 52, 52)",
    level5: "rgb(60, 60, 60)"
  },

  surfaceDisabled: "rgba(230, 230, 230, 0.12)",
  onSurfaceDisabled: "rgba(230, 230, 230, 0.38)",
  backdrop: "rgba(20, 20, 20, 0.4)"
};

// Create custom light theme
export const CustomLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...CustomLightColors,
  },
};

// Create custom dark theme
export const CustomDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...CustomDarkColors,
  },
};

// Export default colors (light theme)
export default  {CustomDarkTheme, CustomLightTheme};
