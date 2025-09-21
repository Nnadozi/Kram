import CustomButton from '@/components/CustomButton'
import ActivityIndicator from '@/components/ActivityIndicator'
import CustomText from '@/components/CustomText'
import Page from '@/components/Page'
import { useUserGroups } from '@/hooks/useUserGroups'
import { useUserStore } from '@/stores/userStore'
import { router } from 'expo-router'
import { Timestamp } from 'firebase/firestore'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Avatar, Card, Icon, useTheme } from 'react-native-paper'


const Profile = () => {
  const {colors} = useTheme();
  const {userProfile, signOut} = useUserStore();
  const { groups: userGroups, loading: loadingGroups } = useUserGroups()
  
  return (
    <Page style={styles.container}>
      <View style={styles.topRow}> 
        <View style={{width: "5%"}}/>
        <CustomText textAlign='center' bold fontSize='2xl'>Profile</CustomText>
        <TouchableOpacity onPress={() => router.push('/(settings)')}>
          <Icon source='cog' size={25} color={colors.onSurfaceVariant} />
        </TouchableOpacity>
      </View>
      <View style={styles.profileHeader}>
        <Avatar.Icon style={{marginVertical: 10}} size={110} icon='account' />
        <CustomText textAlign='center' bold fontSize='xl'>
          {userProfile?.firstName} {userProfile?.lastName}
        </CustomText>
        <CustomText textAlign='center'>
          {userProfile?.school} &apos;{userProfile?.graduationYear?.toString().slice(-2)}
        </CustomText>
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
        {userProfile?.bio && (
          <Card style={[styles.card, {marginTop: 10}]}>
            <Card.Content>
              <CustomText bold fontSize='lg' style={{marginBottom: 10}}>Bio</CustomText>
              <CustomText>{userProfile.bio}</CustomText>
            </Card.Content>
          </Card>
        )}
        <Card style={styles.card}>
          <Card.Content>
            <CustomText bold fontSize='lg' style={{marginBottom: 10}}>Academic Info</CustomText>
            <View style={{flexDirection: 'row', marginBottom: 10, flexWrap: 'wrap'}}>
              <CustomText bold  style={{marginRight: 8}}>Majors:</CustomText>
              <CustomText  style={{flex: 1}}>{userProfile?.majors.join(', ')}</CustomText>
            </View>
            
            {userProfile?.minors && userProfile.minors.length > 0 && (
              <View style={{flexDirection: 'row', marginBottom: 8, flexWrap: 'wrap'}}>
                <CustomText bold>Minors: </CustomText>
                <CustomText>{userProfile.minors.join(', ')}</CustomText>
              </View>
            )}
          </Card.Content>
        </Card>
        {userProfile?.groups && userProfile.groups.length > 0 && (
          <Card style={styles.card}>
            <Card.Content>
              <CustomText bold fontSize='lg' style={{marginBottom: 10}}>
                Groups ({userProfile.groups.length})
              </CustomText>
              
              {loadingGroups ? (
                <ActivityIndicator 
                  size="small" 
                  message="Loading groups..." 
                />
              ) : userGroups.length > 0 ? (
                <View style={styles.groupsList}>
                  {userGroups.map((group) => (
                    <TouchableOpacity
                      key={group.id}
                      style={styles.groupItem}
                      onPress={() => router.push(`/(main)/GroupDetail?groupId=${group.id}`)}
                    >
                      <View style={styles.groupInfo}>
                        <CustomText bold fontSize="sm">{group.name}</CustomText>
                        <CustomText fontSize="xs" gray numberOfLines={1}>
                          {group.description}
                        </CustomText>
                      </View>
                      <Icon source="chevron-right" size={20} color={colors.onSurfaceVariant} />
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <CustomText gray>No groups found</CustomText>
              )}
            </Card.Content>
          </Card>
        )}
        <Card style={styles.card}>
          <Card.Content>
            <CustomText bold fontSize='lg' style={{marginBottom: 10}}>Account Info</CustomText>
            <View style={{flexDirection: 'row'}}>
              <CustomText bold>Joined: </CustomText>
              <CustomText>
                {userProfile?.createdAt 
                  ? (userProfile.createdAt instanceof Date 
                      ? userProfile.createdAt.toLocaleDateString()
                      : userProfile.createdAt instanceof Timestamp
                        ? userProfile.createdAt.toDate().toLocaleDateString()
                        : 'Unknown')
                  : 'Unknown'
                }
              </CustomText>
            </View>
          </Card.Content>
        </Card>
        <CustomButton onPress={() => signOut()}>  Sign Out</CustomButton>
      </ScrollView>
    </Page>
  )
}

export default Profile

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  scrollView: {
    width: '100%',
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginVertical: 10,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  groupsList: {
    gap: 8,
  },
  groupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
  },
  groupInfo: {
    flex: 1,
    gap: 4,
  },
})