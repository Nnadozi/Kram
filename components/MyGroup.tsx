import { Group } from '@/types/Group'
import { router } from 'expo-router'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { Icon, useTheme } from 'react-native-paper'
import CustomText from './CustomText'

interface MyGroupProps {
  group: Group
}

const MyGroup = ({ group }: MyGroupProps) => {
  const { colors } = useTheme()
  
  // Mock notification count - you can replace this with real data later
  const notificationCount = Math.floor(Math.random() * 5) // Random 0-4 notifications
  
  if (!group || !group.name) {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface }]}>
        <CustomText gray>Invalid group data</CustomText>
      </View>
    )
  }
  
  return (
    <TouchableOpacity onPress={() => router.push({
        pathname: '/GroupDetail',
        params: {
            groupId: group.id
        }
    })} activeOpacity={0.75} style={[styles.container,{shadowColor: colors.shadow, backgroundColor: colors.surface}]}>
      
      {/* Header with group name and notification badge */}
      <View style={styles.header}>
        <CustomText bold fontSize="lg" primary style={styles.groupName}>
          {group.name}
        </CustomText>
        <View style={[styles.badge, {backgroundColor: colors.primary}]}>
          <Icon source="bell" size={15} color={colors.onPrimary} />
          <CustomText fontSize="sm" bold opposite>3</CustomText>
        </View>
      </View>
      
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
        <Icon source="calendar" color={"gray"} size={16} />
        <CustomText gray bold fontSize="sm">Next Meetup: 
            <CustomText  fontSize="sm"> Saturday, 4:00 - 6:00 PM</CustomText>  
        </CustomText>  
      </View>
    </TouchableOpacity>
  )
}

export default MyGroup

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 15,
        borderRadius: 10,
        marginVertical: 5,
        elevation: 5,
       shadowOffset: {width: 0, height: 2},
       shadowOpacity: 0.25,
       shadowRadius: 3,
       gap: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    groupName: {
        flex: 1,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        padding: 5,
        borderRadius: 100,
        paddingHorizontal: 10,
    }
})