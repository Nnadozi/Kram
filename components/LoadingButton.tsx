import React from 'react';
import { Button, ButtonProps, useTheme } from 'react-native-paper';
import ActivityIndicator from './ActivityIndicator';

interface LoadingButtonProps extends Omit<ButtonProps, 'loading'> {
  /** Whether the button is in loading state */
  loading?: boolean;
  /** Button variant */
  variant?: 'contained' | 'outlined' | 'text' | 'elevated' | 'contained-tonal';
  /** Button width */
  width?: any;
  /** Loading indicator size */
  loadingSize?: 'small' | number;
  /** Text to show when loading */
  loadingText?: string;
}

/**
 * Enhanced button component with built-in loading state
 * Extends CustomButton functionality with activity indicator
 */
const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading = false,
  variant = 'contained',
  width = '100%',
  loadingSize = 16,
  loadingText,
  children,
  disabled,
  onPress,
  ...props
}) => {
  const { colors } = useTheme();
  
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
      style={[
        {
          borderColor: variant === 'outlined' ? colors.primary : 'transparent',
          width: width || '100%',
        },
        props.style
      ]}
      labelStyle={[
        { fontWeight: 'bold' },
        props.labelStyle
      ]}
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
  );
};

export default LoadingButton;