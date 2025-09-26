import { db } from '@/firebaseConfig'
import { useUserStore } from '@/stores/userStore'
import { Group } from '@/types/Group'
import { doc, getDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useAsyncOperation } from './useAsyncOperation'

interface UseUserGroupsReturn {
  groups: Group[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export const useUserGroups = (): UseUserGroupsReturn => {
  const { userProfile } = useUserStore()
  const [groups, setGroups] = useState<Group[]>([])
  const [error, setError] = useState<string | null>(null)

  const { execute: loadGroups, isLoading } = useAsyncOperation({
    onSuccess: (loadedGroups: Group[]) => {
      setGroups(loadedGroups)
      setError(null)
    },
    onError: (err) => {
      console.error('Error loading user groups:', err)
      setError('Failed to load groups')
      setGroups([])
    },
    showErrorAlert: false
  })

  const fetchUserGroups = async (): Promise<Group[]> => {
    if (!userProfile?.groups || userProfile.groups.length === 0) {
      return []
    }

    const loadedGroups: Group[] = []
    
    // Fetch each group by ID
    for (const groupId of userProfile.groups) {
      try {
        const groupDoc = await getDoc(doc(db, 'groups', groupId))
        if (groupDoc.exists()) {
          loadedGroups.push({ id: groupDoc.id, ...groupDoc.data() } as Group)
        }
      } catch (error) {
        console.error(`Error loading group ${groupId}:`, error)
        // Continue loading other groups even if one fails
      }
    }

    return loadedGroups
  }

  const refetch = () => {
    if (userProfile?.groups) {
      loadGroups(fetchUserGroups)
    }
  }

  useEffect(() => {
    if (userProfile?.groups && userProfile.groups.length > 0) {
      loadGroups(fetchUserGroups)
    } else {
      setGroups([])
      setError(null)
    }
  }, [userProfile?.groups])

  return {
    groups,
    loading: isLoading,
    error,
    refetch
  }
}

/**
 * Full example usage:
 * const { groups, loading, error, refetch } = useUserGroups()
 * console.log(groups)
 * console.log(loading)
 * console.log(error)
 * console.log(refetch)
 *
 * const { execute: loadGroups } = useAsyncOperation({
 *   onSuccess: (loadedGroups: Group[]) => {
 *     setGroups(loadedGroups)
 *     setError(null)
 *   },
 *   onError: (err) => {
 *     console.error('Error loading user groups:', err)
 *     setError('Failed to load groups')
 *     setGroups([])
 *   },
 *   showErrorAlert: false
 * })
 */
