import { DimensionValue, KeyboardTypeOptions, TextStyle } from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';

interface MyInputProps {
    placeholder: string;
    value?: string;
    onChangeText?: (text: string) => void;
    mode?: 'flat' | 'outlined';

    style?: TextStyle;
    width?: DimensionValue;
    maxLength?: number;
    keyboardType?: KeyboardTypeOptions;
    multiline?: boolean;
    numberOfLines?: number;
    onSubmitEditing?: () => void;
    returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
    editable?: boolean;
    textAlign?: 'left' | 'right' | 'center';
}

const MyInput = ({
    placeholder, 
    value = '', 
    onChangeText = () => {}, 
    mode = 'outlined',
    style, 
    width = '100%', 
    maxLength, 
    keyboardType, 
    multiline, 
    numberOfLines, 
    onSubmitEditing, 
    returnKeyType, 
    editable, 
    textAlign
}: MyInputProps) => {
  const theme = useTheme()
  return (
    <TextInput
      value={value}
      placeholder={placeholder}
      onChangeText={onChangeText}
      mode={mode}
      style={[ { width }, style]}
      maxLength={maxLength}
      keyboardType={keyboardType}
      multiline={multiline}
      numberOfLines={numberOfLines}
      onSubmitEditing={onSubmitEditing}
      returnKeyType={returnKeyType}
      editable={editable}
      textAlign={textAlign}
      placeholderTextColor={"gray"}
      focusable
    />
  )
}

export default MyInput
