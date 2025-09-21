import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import ActivityIndicator from './ActivityIndicator';

interface LoadingOverlayProps {
  /** Whether the overlay is visible */
  visible: boolean;
  /** Loading message to display */
  message?: string;
  /** Whether the overlay can be dismissed by tapping */
  dismissable?: boolean;
  /** Callback when overlay is dismissed */
  onDismiss?: () => void;
  /** Custom background color */
  backgroundColor?: string;
  /** Size of the activity indicator */
  indicatorSize?: 'small' | 'large' | number;
}

/**
 * Full-screen loading overlay component
 * Blocks user interaction while displaying loading state
 */
const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  message = 'Loading...',
  dismissable = false,
  onDismiss,
  backgroundColor,
  indicatorSize = 'large'
}) => {
  const { colors } = useTheme();

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={dismissable ? onDismiss : undefined}
      statusBarTranslucent
    >
      <View 
        style={[
          styles.overlay,
          { backgroundColor: backgroundColor || colors.backdrop }
        ]}
        onTouchEnd={dismissable ? onDismiss : undefined}
      >
        <View style={[styles.content, { backgroundColor: colors.surface }]}>
          <ActivityIndicator
            size={indicatorSize}
            message={message}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 32,
    borderRadius: 12,
    minWidth: 150,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default LoadingOverlay;