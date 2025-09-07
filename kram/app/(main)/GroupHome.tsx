import { StyleSheet,  View } from 'react-native'
import React, { useState } from 'react'
import { router, useGlobalSearchParams, useLocalSearchParams } from 'expo-router'
import { useUserStore } from '@/stores/userStore'
import { Page } from '@/components/page'
import { Text } from '@/components/ui/text'
import { Button } from '@/components/ui/button'
import { useEffect } from 'react'
import { db } from '@/firebase/firebaseConfig'
import { doc, getDoc } from 'firebase/firestore'
import { Group } from '@/types/Group'

const GroupHome = () => {
  const { groupId } = useGlobalSearchParams()
  const [group, setGroup] = useState<Group | null>(null)

  useEffect(() => {
    async function fetchGroup() {
      const docRef = doc(db, 'groups', groupId as string)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        console.log('group found successfully', docSnap.data())
        setGroup(docSnap.data() as Group)
      }
    }
    fetchGroup()
  }, [])
  return (
    <Page>
      <Text>{groupId as string}</Text>
      <Text>{group?.name}</Text>
      <Text>{group?.description}</Text>
      <Button onPress={() => router.back()}>
        <Text>Back</Text>
      </Button>
    </Page>
  )
}

export default GroupHome