import { useState, useCallback } from 'react'
import { Alert } from 'react-native'

interface UseAsyncOperationOptions {
  /** Callback function called when the operation succeeds */
  onSuccess?: (result: any) => void
  /** Callback function called when the operation fails */
  onError?: (error: Error) => void
  /** Whether to show an error alert when operation fails (default: true) */
  showErrorAlert?: boolean
  /** Custom error message to show in alert (default: 'An error occurred. Please try again.') */
  errorMessage?: string
}

/**
 * Return type of the useAsyncOperation hook
 */
interface UseAsyncOperationReturn {
  /** Function to execute async operations with automatic loading and error handling */
  execute: (operation: () => Promise<any>) => Promise<any>
  /** Boolean indicating if an operation is currently running */
  isLoading: boolean
  /** Error object if the last operation failed, null otherwise */
  error: Error | null
}

/**
 * Custom hook that provides automatic loading states and error handling for async operations.
 * 
 * This hook eliminates the need to manually manage loading states, try/catch blocks,
 * and error alerts for async operations. It provides a consistent pattern across your app.
 * 
 * @param options - Configuration options for the hook
 * @returns Object containing execute function, loading state, and error state
 * 
 * @example
 * ```typescript
 * // Basic usage
 * const { execute: fetchData, isLoading } = useAsyncOperation({
 *   errorMessage: 'Failed to load data. Please try again.',
 *   onSuccess: (data) => setData(data)
 * })
 * 
 * // Execute an operation
 * fetchData(async () => {
 *   const response = await fetch('/api/data')
 *   return response.json()
 * })
 * ```
 * 
 * @example
 * ```typescript
 * // With custom error handling
 * const { execute: saveData, isLoading } = useAsyncOperation({
 *   onSuccess: (result) => {
 *     console.log('Saved successfully:', result)
 *     router.back()
 *   },
 *   onError: (error) => {
 *     console.error('Custom error handling:', error)
 *     // Custom error handling instead of alert
 *   },
 *   showErrorAlert: false
 * })
 * ```
 */
export function useAsyncOperation(options: UseAsyncOperationOptions = {}): UseAsyncOperationReturn {
  // Internal state for loading and error management
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Destructure options with defaults
  const {
    onSuccess,
    onError,
    showErrorAlert = true,
    errorMessage = 'An error occurred. Please try again.'
  } = options

  /**
   * Executes an async operation with automatic loading state management and error handling.
   * 
   * @param operation - The async function to execute
   * @returns Promise that resolves with the operation result or rejects with error
   */
  const execute = useCallback(async (operation: () => Promise<any>) => {
    try {
      // Set loading state and clear any previous errors
      setIsLoading(true)
      setError(null)
      
      // Execute the provided operation
      const result = await operation()
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(result)
      }
      
      return result
    } catch (err) {
      // Handle errors consistently
      const error = err as Error
      setError(error)
      console.error('Async operation error:', error)
      
      // Call custom error handler or show default alert
      if (onError) {
        onError(error)
      } else if (showErrorAlert) {
        Alert.alert('Error', errorMessage)
      }
      
      // Re-throw error so calling code can handle it if needed
      throw error
    } finally {
      // Always clear loading state
      setIsLoading(false)
    }
  }, [onSuccess, onError, showErrorAlert, errorMessage])

  return {
    execute,
    isLoading,
    error
  }
}