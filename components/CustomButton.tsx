import { StyleSheet } from 'react-native';
import { Button, ButtonProps, useTheme } from 'react-native-paper';
import ActivityIndicator from './ActivityIndicator';

interface CustomButtonProps extends ButtonProps {
  variant?: 'contained' | 'outlined' | 'text' | 'elevated' | 'contained-tonal';
  width?: any;
  /** Whether the button is in loading state */
  loading?: boolean;
  /** Loading indicator size */
  loadingSize?: 'small' | number;
  /** Text to show when loading */
  loadingText?: string;
}
//make variant contained default
const CustomButton = ({
  variant = "contained", 
  width = "100%", 
  loading = false,
  loadingSize = 16,
  loadingText,
  disabled,
  onPress,
  children,
  ...props
}: CustomButtonProps) => {
  const {colors} = useTheme();
  
  // Button is disabled when loading
  const isDisabled = disabled || loading;
  
  // Show loading text if provided, otherwise keep original text
  const buttonText = loading && loadingText ? loadingText : children;

  return (
    <Button
      {...props}
      mode={variant}
      disabled={isDisabled}
      onPress={loading ? undefined : onPress}
      style={{borderColor: variant === "outlined" ? colors.primary : "transparent", width: width || "100%",}}
      labelStyle={{fontWeight: "bold"}}
      icon={loading ? () => (
        <ActivityIndicator 
          size={loadingSize} 
          color={variant === 'contained' ? colors.onPrimary : colors.primary}
          style={{ marginRight: 4 }}
        />
      ) : props.icon}
    >
      {buttonText}
    </Button>
  )
}

export default CustomButton

const styles = StyleSheet.create({})