import { useNetwork } from '@/contexts/NetworkContext'
import { StyleSheet, View } from 'react-native'
import CustomText from './CustomText'

/**
 * Debug component to show network state - remove in production
 */
export const NetworkDebug = () => {
  const { isConnected, isInternetReachable, isOffline, networkType } = useNetwork()

  return (
    <View style={styles.container}>
      <CustomText color="white" fontSize="xs">
        Network Debug:
      </CustomText>
      <CustomText color="white" fontSize="xs">
        Connected: {isConnected ? 'YES' : 'NO'}
      </CustomText>
      <CustomText color="white" fontSize="xs">
        Internet: {isInternetReachable ? 'YES' : 'NO'}
      </CustomText>
      <CustomText color="white" fontSize="xs">
        Offline: {isOffline ? 'YES' : 'NO'}
      </CustomText>
      <CustomText color="white" fontSize="xs">
        Type: {networkType || 'Unknown'}
      </CustomText>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 50,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 10,
    borderRadius: 5,
    zIndex: 9999,
    minWidth: 150,
  }
})
