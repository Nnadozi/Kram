/**
 * Network helper utilities for service layer
 * Provides network checking and error handling for Firebase operations
 */

export class NetworkError extends Error {
  constructor(message: string = 'No internet connection available') {
    super(message)
    this.name = 'NetworkError'
  }
}

/**
 * Checks if an error is network-related
 */
export const isNetworkError = (error: any): boolean => {
  if (!error) return false
  
  const errorMessage = error.message?.toLowerCase() || ''
  const errorCode = error.code?.toLowerCase() || ''
  
  return (
    error instanceof NetworkError ||
    errorMessage.includes('network') ||
    errorMessage.includes('fetch') ||
    errorMessage.includes('internet') ||
    errorMessage.includes('offline') ||
    errorCode.includes('network') ||
    errorCode.includes('unavailable') ||
    errorCode === 'failed-precondition'
  )
}

/**
 * Wraps a service operation with network error handling
 */
export const withNetworkErrorHandling = async <T>(
  operation: () => Promise<T>,
  customErrorMessage?: string
): Promise<T> => {
  try {
    return await operation()
  } catch (error) {
    if (isNetworkError(error)) {
      throw new NetworkError(
        customErrorMessage || 'This operation requires an internet connection. Please check your connection and try again.'
      )
    }
    throw error
  }
}
