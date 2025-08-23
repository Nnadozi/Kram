import { DimensionValue, KeyboardTypeOptions, TextStyle, View } from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';
import MyText from './MyText';

interface MyInputProps {
    placeholder: string;
    value?: string;
    onChangeText?: (text: string) => void;
    mode?: 'flat' | 'outlined';
    secureTextEntry?: boolean;

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
    onFocus?: () => void;
    label?: string;
    showMaxLength?: boolean;
}

const MyInput = ({
    placeholder, 
    value = '', 
    onChangeText = () => {}, 
    mode = 'outlined',
    secureTextEntry = false,
    style, 
    width = '100%', 
    maxLength, 
    keyboardType, 
    multiline, 
    numberOfLines, 
    onSubmitEditing, 
    returnKeyType, 
    editable, 
    textAlign,
    onFocus,
    label,
    showMaxLength = false
}: MyInputProps) => {
  const theme = useTheme()
  return (
    <View style={{ width }}>
      <TextInput
        value={value}
        placeholder={placeholder}
        onChangeText={onChangeText}
        mode={mode}
        style={[{ width: '100%' }, style]}
        maxLength={maxLength}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        onSubmitEditing={onSubmitEditing}
        returnKeyType={returnKeyType}
        editable={editable}
        textAlign={textAlign}
        placeholderTextColor={"gray"}
        onFocus={onFocus}
        label={label}
        autoCapitalize='none'
        textAlignVertical='top'
        secureTextEntry={secureTextEntry}
      />
      {showMaxLength && (
        <MyText textAlign='right' gray>
          {value.length}/{maxLength}
        </MyText>
      )}
    </View>
  )
}

export default MyInput
