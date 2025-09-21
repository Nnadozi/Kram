import BioEditModal from '@/components/BioEditModal'
import CustomButton from '@/components/CustomButton'
import CustomText from '@/components/CustomText'
import MajorsMinorsEditModal from '@/components/MajorsMinorsEditModal'
import Page from '@/components/Page'
import ProfileColorPickerModal from '@/components/ProfileColorPickerModal'
import { useModal } from '@/hooks/useModal'
import { useUserGroups } from '@/hooks/useUserGroups'
import { useUserStore } from '@/stores/userStore'
import { router } from 'expo-router'
import { Timestamp } from 'firebase/firestore'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Avatar, Card, Icon, useTheme } from 'react-native-paper'


const Profile = () => {
  const {colors} = useTheme();
  const {userProfile, signOut, getCurrentPrimaryColor} = useUserStore();
  const { groups: userGroups, loading: loadingGroups } = useUserGroups()
  
  // Modal states for editing different profile sections
  const bioModal = useModal()
  const majorsMinorsModal = useModal()
  const colorPickerModal = useModal()
  
  // Get user's profile color for avatar
  const profileColor = getCurrentPrimaryColor()
  
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
        <TouchableOpacity onPress={colorPickerModal.open} style={styles.avatarContainer}>
          <Avatar.Icon 
            style={[styles.avatar, { backgroundColor: profileColor }]} 
            size={110} 
            icon='account' 
          />
          <View style={styles.editIconOverlay}>
            <Icon source='pencil' size={16} color='white' />
          </View>
        </TouchableOpacity>
        <CustomText textAlign='center' bold fontSize='xl'>
          {userProfile?.firstName} {userProfile?.lastName}
        </CustomText>
        <CustomText textAlign='center'>
          {userProfile?.school} &apos;{userProfile?.graduationYear?.toString().slice(-2)}
        </CustomText>
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
        <Card style={[styles.card, {marginTop: 10}]}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <CustomText bold fontSize='lg'>Bio</CustomText>
              <TouchableOpacity onPress={bioModal.open} style={styles.editButton}>
                <Icon source='pencil' size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
            <CustomText>
              {userProfile?.bio || 'No bio added yet. Tap the pencil to add one!'}
            </CustomText>
          </Card.Content>
        </Card>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <CustomText bold fontSize='lg'>Academic Info</CustomText>
              <TouchableOpacity onPress={majorsMinorsModal.open} style={styles.editButton}>
                <Icon source='pencil' size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
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
                <CustomText gray>Loading groups...</CustomText>
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

      {/* Modals */}
      <BioEditModal
        visible={bioModal.visible}
        onClose={bioModal.close}
      />
      
      <MajorsMinorsEditModal
        visible={majorsMinorsModal.visible}
        onClose={majorsMinorsModal.close}
      />
      
      <ProfileColorPickerModal
        visible={colorPickerModal.visible}
        onClose={colorPickerModal.close}
      />
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
  avatarContainer: {
    position: 'relative',
    marginVertical: 10,
  },
  avatar: {
    marginVertical: 10,
  },
  editIconOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  editButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
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

// DONE!