import { useNetwork } from '@/contexts/NetworkContext'
import { useCallback, useState } from 'react'

interface NetworkCheckOptions {
  showModal?: boolean
  onOffline?: () => void
  offlineTitle?: string
  offlineMessage?: string
}

/**
 * Hook for checking network connectivity before operations
 * Provides methods to validate network and show offline modal
 */
export const useNetworkCheck = () => {
  const { isOffline } = useNetwork()
  const [showOfflineModal, setShowOfflineModal] = useState(false)
  const [modalConfig, setModalConfig] = useState<{
    title?: string
    message?: string
    onRetry?: () => void
  }>({})

  /**
   * Checks if network is available and optionally shows modal if offline
   */
  const checkNetwork = useCallback((options?: NetworkCheckOptions): boolean => {
    if (isOffline) {
      if (options?.showModal !== false) {
        setModalConfig({
          title: options?.offlineTitle,
          message: options?.offlineMessage,
        })
        setShowOfflineModal(true)
      }
      
      if (options?.onOffline) {
        options.onOffline()
      }
      
      return false
    }
    return true
  }, [isOffline])

  /**
   * Wraps an async operation with network check
   */
  const withNetworkCheck = useCallback(async <T,>(
    operation: () => Promise<T>,
    options?: NetworkCheckOptions & { onRetry?: () => void }
  ): Promise<T | null> => {
    if (!checkNetwork(options)) {
      if (options?.onRetry) {
        setModalConfig(prev => ({
          ...prev,
          onRetry: options.onRetry
        }))
      }
      return null
    }
    
    try {
      return await operation()
    } catch (error) {
      // Check if error is network-related
      if (error instanceof Error && 
          (error.message.includes('network') || 
           error.message.includes('Network') ||
           error.message.includes('fetch'))) {
        setModalConfig({
          title: 'Connection Error',
          message: 'Failed to complete the operation. Please check your internet connection.',
          onRetry: options?.onRetry
        })
        setShowOfflineModal(true)
      }
      throw error
    }
  }, [checkNetwork])

  const closeOfflineModal = useCallback(() => {
    setShowOfflineModal(false)
    setModalConfig({})
  }, [])

  return {
    isOffline,
    checkNetwork,
    withNetworkCheck,
    showOfflineModal,
    closeOfflineModal,
    modalConfig
  }
}
