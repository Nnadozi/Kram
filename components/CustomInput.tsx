import React from 'react';
import { View } from 'react-native';
import { TextInput, TextInputProps, useTheme } from 'react-native-paper';
import CustomText from './CustomText';
  
interface CustomInputProps extends TextInputProps {
  // Add any custom props here
  showPasswordToggle?: boolean;
  onTogglePassword?: () => void;
  showCharCounter?: boolean;
  maxLength?: number;
}

const CustomInput: React.FC<CustomInputProps> = ({ 
  style,
  placeholderTextColor,
  outlineColor,
  activeOutlineColor,
  textColor,
  showPasswordToggle = false,
  onTogglePassword,
  secureTextEntry,
  showCharCounter = false,
  maxLength,
  value,
  ...props 
}) => {
  const theme = useTheme();
  
  const currentLength = value ? value.toString().length : 0;
  const shouldShowCounter = showCharCounter && maxLength;
  
  return (
    <View>
      <TextInput
        {...props}
        style={style}
        value={value}
        maxLength={maxLength}
        //make this gray
        placeholderTextColor={placeholderTextColor || "lightgray"}
        outlineColor={outlineColor || "lightgray"}
        mode="outlined"
        secureTextEntry={secureTextEntry}
        right={
          showPasswordToggle ? (
            <TextInput.Icon
              icon={secureTextEntry ? "eye" : "eye-off"}
              onPress={onTogglePassword}
            />
          ) : undefined
        }
      />
      {shouldShowCounter && (
        <CustomText 
          textAlign='right'
          fontSize='xs'
          gray
          style={{ marginTop: 5 }}
        >
          {currentLength}/{maxLength}
        </CustomText>
      )}
    </View>
  );
};

export default CustomInput;