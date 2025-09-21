import React from 'react';
import { ActivityIndicator as RNActivityIndicator, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import CustomText from './CustomText';

interface ActivityIndicatorProps {
  /** Size of the activity indicator */
  size?: 'small' | 'large' | number;
  /** Custom color for the indicator */
  color?: string;
  /** Loading message to display below the indicator */
  message?: string;
  /** Message color */
  messageColor?: string;
  /** Container style */
  style?: ViewStyle;
  /** Whether to show the indicator */
  visible?: boolean;
}

/**
 * Reusable activity indicator component with consistent styling
 * Uses the app's theme colors by default
 */
const ActivityIndicator: React.FC<ActivityIndicatorProps> = ({
  size = 'small',
  color,
  message,
  messageColor,
  style,
  visible = true
}) => {
  const { colors } = useTheme();

  if (!visible) return null;

  return (
    <View style={[styles.container, style]}>
      <RNActivityIndicator 
        size={size}
        color={color || colors.primary}
        testID="activity-indicator"
      />
      {message && (
        <CustomText 
          style={[styles.message, { color: messageColor || colors.onSurfaceVariant }]}
          fontSize="sm"
          textAlign="center"
        >
          {message}
        </CustomText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    marginTop: 8,
  },
});

export default ActivityIndicator;