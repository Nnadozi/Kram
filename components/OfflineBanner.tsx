import { useNetwork } from '@/contexts/NetworkContext'
import { MaterialIcons } from '@expo/vector-icons'
import { useEffect, useRef } from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import { useTheme } from 'react-native-paper'
import CustomText from './CustomText'

/**
 * OfflineBanner displays a persistent banner when the user is offline
 * Slides down from top with animation when offline, slides up when online
 */
export const OfflineBanner = () => {
  const { colors } = useTheme()
  const { isOffline } = useNetwork()
  const slideAnim = useRef(new Animated.Value(-60)).current

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isOffline ? 0 : -60,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }, [isOffline, slideAnim])

  // Don't render anything if we're online
  if (!isOffline) {
    return null
  }

  return (
    <Animated.View 
      style={[
        styles.container,
        { 
          backgroundColor: colors.error,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <View style={styles.content}>
        <MaterialIcons name="wifi-off" size={18} color={colors.onError} />
        <CustomText 
          color={colors.onError}
          fontSize="sm"
          style={styles.text}
        >
          No internet connection
        </CustomText>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingTop: 45, // Account for status bar
    paddingBottom: 10,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  text: {
    fontWeight: '500',
  },
})
