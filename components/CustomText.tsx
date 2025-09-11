import React from 'react';
import { Text, TextStyle } from 'react-native';
import { useTheme } from 'react-native-paper';

interface CustomTextProps {
    children:React.ReactNode
    style?:TextStyle
    color?: string;
    fontSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';  
    bold?: boolean;  
    opacity?: number;
    textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify';
    numberOfLines?: number;
    onPress?: () => void;
    primary?: boolean;
    secondary?: boolean;
    italic?: boolean;
    opposite?: boolean;
    gray?: boolean;
}

const fontSizes = {
  xs: 12,    // Extra small - captions, labels
  sm: 14,    // Small - secondary text
  base: 16,  // Base - body text (normal)
  lg: 18,    // Large - subheadings
  xl: 20,    // Extra large - headings
  '2xl': 24, // 2X large - large headings
  '3xl': 30, // 3X large - hero text
  '4xl': 36, // 4X large - display text
};

  const CustomText = ({children, style, onPress, color, fontSize = 'base', bold, opacity, textAlign,primary, secondary, numberOfLines, italic, opposite, gray}:CustomTextProps) => {
  const {colors} = useTheme();
  return (
    <Text 
    numberOfLines={numberOfLines}
    onPress={onPress} 
    style={[style, 
      {
        color: color ? color : primary ? colors.primary : secondary ? colors.secondary : opposite ? colors.background : gray ? "gray" : colors.onSurface,
        opacity,
        textAlign,
        fontSize: fontSizes[fontSize],
        fontWeight: bold ? 'bold' : 'normal',
        fontStyle: italic ? 'italic' : 'normal',
      }
    ]}>
      {children}
    </Text>
  )
}

export default CustomText