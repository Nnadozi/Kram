import { useCallback, useState } from 'react'
import { Alert } from 'react-native'

interface UseAsyncOperationOptions {
  onSuccess?: (result: any) => void
  onError?: (error: Error) => void
  showErrorAlert?: boolean
  errorMessage?: string
}

interface UseAsyncOperationReturn {
  execute: (operation: () => Promise<any>) => Promise<any>
  isLoading: boolean
  error: Error | null
}

export function useAsyncOperation(options: UseAsyncOperationOptions = {}): UseAsyncOperationReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const { onSuccess, onError, showErrorAlert, errorMessage } = options
  const execute = useCallback(async (operation: () => Promise<any>) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const result = await operation()
      
      if (onSuccess) {
        onSuccess(result)
      }
      
      return result
    } catch (err) {
      const error = err as Error
      setError(error)
      console.error('Async operation error:', error)
      
      if (onError) {
        onError(error)
      } else if (showErrorAlert) {
        Alert.alert('Error', errorMessage)
      }
      
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [onSuccess, onError, showErrorAlert, errorMessage])

  return {
    execute,
    isLoading,
    error
  }
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
 * // Complete example showcasing all features
 * const { execute: fetchData, isLoading, error } = useAsyncOperation({
 *   errorMessage: 'Failed to load data. Please try again.',
 *   onSuccess: (data) => {
 *     console.log('Data loaded successfully:', data)
 *     setData(data)
 *     // Navigate or show success message
 *   },
 *   onError: (error) => {
 *     console.error('Custom error handling:', error)
 *     // Custom error handling instead of default alert
 *   },
 *   showErrorAlert: false // Disable default error alert
 * })
 * 
 * // Execute an operation
 * const handleLoadData = () => {
 *   fetchData(async () => {
 *     const response = await fetch('/api/data')
 *     if (!response.ok) throw new Error('Network error')
 *     return response.json()
 *   })
 * }
 * 
 * // In your component
 * return (
 *   <View>
 *     <Button onPress={handleLoadData} disabled={isLoading}>
 *       {isLoading ? 'Loading...' : 'Load Data'}
 *     </Button>
 *     {error && <Text style={{color: 'red'}}>{error}</Text>}
 *   </View>
 * )
 * ```
 * ```
 */