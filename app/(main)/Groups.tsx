import CustomText from '@/components/CustomText'
import MyGroup from '@/components/MyGroup'
import Page from '@/components/Page'
import { useUserStore } from '@/stores/userStore'
import { useFocusEffect } from '@react-navigation/native'
import { useCallback } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { Icon, useTheme } from 'react-native-paper'

const Groups = () => {
  const { userProfile, setUserProfile } = useUserStore()
  const groups = userProfile?.groups || []
  const { colors } = useTheme()

  const clearGroups = () => {
    setUserProfile({ groups: [] })
    console.log('Groups cleared!')
  }

  useFocusEffect(
    useCallback(() => {
      // This will run every time the screen comes into focus
      // The groups will automatically update from the store
      console.log('Groups tab focused - refreshing groups list')
      console.log('Current groups:', groups.map(g => g.name))
    }, [groups])
  )

  const renderGroup = ({ item }: { item: any }) => {
    if (!item) return null
    return <MyGroup group={item} />
  }

  return (
    <Page style={{justifyContent: 'flex-start', alignItems: 'flex-start'}}>
      <View style={styles.header}>
        <CustomText bold fontSize='2xl'>
          My Groups
        </CustomText>
      </View>
      
      {groups.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon source='emoticon-sad' size={100} color="gray" />
          <CustomText bold fontSize='base' textAlign='center' gray>
            No groups found
          </CustomText>
          <CustomText fontSize='sm' textAlign='center' gray style={{ marginTop: 8 }}>
            Visit the Discover tab to get started
          </CustomText>
        </View>
      ) : (
        <FlatList
          data={groups}
          renderItem={renderGroup}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
          style={styles.list}
        />
      )}
    </Page>
  )
}

export default Groups

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  list: {
    width: '100%',
  },
  contentContainer: {
    paddingBottom: 20,
    paddingHorizontal: 8,
  },
})