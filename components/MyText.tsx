import React from 'react';
import { Text, TextStyle } from 'react-native';
import { useTheme } from 'react-native-paper';

interface MyTextProps {
    children:React.ReactNode
    style?:TextStyle
    color?: string;
    fontSize?:  'normal' | 'large' | 'XL';  
    bold?: boolean;  
    opacity?: number;
    textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify';
    numberOfLines?: number;
    onPress?: () => void;
    primary?: boolean;
    italic?: boolean;
    opposite?: boolean;
    gray?: boolean;
}

const fontSizes = {normal: undefined, large: 20, XL: 30};

  const MyText = ({children, style, onPress, color, fontSize = 'normal', bold, opacity, textAlign, primary, numberOfLines, italic, opposite, gray}:MyTextProps) => {
   const theme = useTheme()
  return (
    <Text 
    numberOfLines={numberOfLines}
    onPress={onPress} 
    style={[style, 
      {
        color: color ? color : primary ? theme.colors.primary : opposite ? theme.colors.background : gray ? "gray" : theme.dark ? "white" : "black",
        opacity,
        textAlign,
        fontSize: fontSizes[fontSize],
        fontWeight: bold ? "bold" : undefined,
        fontStyle: italic ? "italic" : "normal"
      }
    ]}>
      {children}
    </Text>
  )
}

export default MyText