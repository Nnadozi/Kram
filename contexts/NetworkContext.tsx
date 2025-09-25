import * as Network from 'expo-network'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'

interface NetworkContextType {
  isConnected: boolean
  isInternetReachable: boolean
  networkType: Network.NetworkStateType | null
  isOffline: boolean
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined)

interface NetworkProviderProps {
  children: ReactNode
}

/**
 * NetworkProvider manages network connectivity state globally
 * Monitors real-time network changes and provides status to all components
 */
export const NetworkProvider = ({ children }: NetworkProviderProps) => {
  const [networkState, setNetworkState] = useState<NetworkContextType>({
    isConnected: true, // Assume connected initially
    isInternetReachable: true,
    networkType: null,
    isOffline: false // Start assuming online
  })

  useEffect(() => {
    let mounted = true

    // Check initial network state
    const checkInitialState = async () => {
      try {
        const state = await Network.getNetworkStateAsync()
        console.log('Initial network state:', state)
        if (mounted) {
          const isOffline = !(state.isConnected === true && state.isInternetReachable === true)
          console.log('Computed isOffline:', isOffline)
          setNetworkState({
            isConnected: state.isConnected ?? false,
            isInternetReachable: state.isInternetReachable ?? false,
            networkType: state.type ?? null,
            isOffline
          })
        }
      } catch (error) {
        console.warn('Failed to get initial network state:', error)
        // Assume offline if we can't get network state
        if (mounted) {
          setNetworkState({
            isConnected: false,
            isInternetReachable: false,
            networkType: null,
            isOffline: true
          })
        }
      }
    }

    checkInitialState()

    // Subscribe to network state changes
    const subscription = Network.addNetworkStateListener((state) => {
      if (mounted) {
        const isOffline = !(state.isConnected === true && state.isInternetReachable === true)
        console.log('Network state changed:', state, 'isOffline:', isOffline)
        
        setNetworkState({
          isConnected: state.isConnected ?? false,
          isInternetReachable: state.isInternetReachable ?? false,
          networkType: state.type ?? null,
          isOffline
        })
      }
    })

    return () => {
      mounted = false
      subscription.remove()
    }
  }, [])

  return (
    <NetworkContext.Provider value={networkState}>
      {children}
    </NetworkContext.Provider>
  )
}

/**
 * Hook to access network state
 */
export const useNetwork = () => {
  const context = useContext(NetworkContext)
  if (context === undefined) {
    throw new Error('useNetwork must be used within a NetworkProvider')
  }
  return context
}
