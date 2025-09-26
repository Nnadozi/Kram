import ActivityIndicator from '@/components/ActivityIndicator';
import CustomButton from '@/components/CustomButton';
import CustomText from '@/components/CustomText';
import MeetupCreationModal from '@/components/MeetupCreationModal';
import MeetupPreview from '@/components/MeetupPreview';
import Page from '@/components/Page';
import { db } from '@/firebaseConfig';
import { useAsyncOperation } from '@/hooks/useAsyncOperation';
import { groupService } from '@/services/groupService';
import { meetupService } from '@/services/meetupService';
import { useUserStore } from '@/stores/userStore';
import { Group } from '@/types/Group';
import { Meetup } from '@/types/Meetup';
import { UserProfile } from '@/types/UserProfile';
import { formatCreatedAt } from '@/util/dateUtils';
import { getFirebaseErrorMessage } from '@/util/firebaseErrors';
import { router, useGlobalSearchParams } from 'expo-router';
import { deleteDoc, doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Chip, useTheme } from 'react-native-paper';


export default function GroupDetail() {
  const { groupId } = useGlobalSearchParams();
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<UserProfile[]>([]);
  const [meetups, setMeetups] = useState<Meetup[]>([]);
  const [showCreateMeetupModal, setShowCreateMeetupModal] = useState(false);
  const { colors } = useTheme();
  const { userProfile, setUserProfile } = useUserStore();

  const { execute: fetchGroupData, isLoading } = useAsyncOperation({
    onSuccess: ({ group, members, meetups }) => {
      setGroup(group);
      setMembers(members);
      setMeetups(meetups);
    },
    showErrorAlert: false
  });

  const { execute: deleteGroup, isLoading: isDeleting } = useAsyncOperation({
    onSuccess: () => {
      Alert.alert('Success', 'Group deleted successfully!');
      router.back();
    },
    onError: (error) => {
      const errorMessage = getFirebaseErrorMessage(error);
      Alert.alert('Error', errorMessage);
    },
    showErrorAlert: false
  });

  const handleDeleteGroup = () => {
    Alert.alert(
      'Delete Group',
      'Are you sure you want to delete this group? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            if (!group || !userProfile) return;
            
            deleteGroup(async () => {
              // Delete from groups collection
              await deleteDoc(doc(db, 'groups', group.id));
              
              // Remove from user's groups array (now contains IDs instead of objects)
              const updatedGroups = userProfile.groups.filter(groupId => groupId !== group.id);
              setUserProfile({ groups: updatedGroups });
              
              return { success: true };
            });
          }
        }
      ]
    );
  };

  useEffect(() => {
    if (!groupId) return;

    fetchGroupData(async () => {
      const groupDoc = await getDoc(doc(db, 'groups', groupId as string));
      if (!groupDoc.exists()) throw new Error('Group not found');

      const groupData = { id: groupDoc.id, ...groupDoc.data() } as Group;

      // Use the new utility functions
      const [members, meetups] = await Promise.all([
        groupService.getGroupMembers(groupData.id),
        meetupService.getGroupMeetups(groupData.id)
      ]);

      return {
        group: groupData,
        members,
        meetups
      };
    });
  }, [groupId]);

  if (isLoading) return (
    <Page style={styles.container}>
      <ActivityIndicator 
        size="large" 
        message="Loading group details..." 
        style={{ marginTop: 50 }}
      />
    </Page>
  );
  if (!group) return <Page style={styles.container}><CustomText gray>Group not found</CustomText><Button title="Back" onPress={() => router.back()} /></Page>;

  const MembersList = () => (
    <View style={styles.section}>
      <CustomText bold fontSize="lg" style={styles.sectionTitle}>Members ({members.length})</CustomText>
      {members.map(member => (
        <View key={member.uid} style={styles.memberRow}>
          <Avatar.Text size={32} label={`${member.firstName?.[0] || ''}${member.lastName?.[0] || ''}`.toUpperCase() || 'U'} />
          <CustomText fontSize="base">
            {member.firstName} {member.lastName}
            {member.uid === group.createdBy && <CustomText fontSize="base" style={{ color: colors.primary }}> (owner)</CustomText>}
          </CustomText>
        </View>
      ))}
      {members.length === 0 && <CustomText gray>No member details available</CustomText>}
    </View>
  );

  const MeetupsList = () => (
    <View style={styles.section}>
      <CustomText bold fontSize="lg" style={styles.sectionTitle}>Meetups ({meetups.length})</CustomText>
      {meetups.map(meetup => (
        <MeetupPreview
          key={meetup.id}
          meetup={meetup}
          onDelete={(meetupId: string) => {
            // Remove the deleted meetup from the list
            setMeetups(prev => prev.filter(m => m.id !== meetupId))
          }}
        />
      ))}
      {meetups.length === 0 && <CustomText gray>No meetups scheduled</CustomText>}
    </View>
  );

  return (
    <Page style={styles.container}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        <CustomText bold fontSize="xl" style={styles.title}>{group.name}</CustomText>
        <CustomText fontSize="base" style={styles.description}>{group.description}</CustomText>

        <View style={styles.infoRow}>
          <CustomText fontSize="base">📅 Created: <CustomText bold>{formatCreatedAt(group.createdAt)}</CustomText></CustomText>
        </View>

        {group.subjects?.length > 0 && (
          <View style={styles.section}>
            <CustomText bold fontSize="lg" style={styles.sectionTitle}>Subjects</CustomText>
            <View style={styles.subjectsContainer}>
              {group.subjects.map((subject, index) => (
                <Chip key={index} style={[styles.subjectChip, { backgroundColor: colors.primaryContainer }]} textStyle={{ color: colors.onPrimaryContainer }}>
                  {subject}
                </Chip>
              ))}
            </View>
          </View>
        )}

        <MembersList />
        
        {/* Group Chat Button - Only for members */}
        {userProfile?.uid && group.members.includes(userProfile.uid) && (
          <View style={styles.section}>
            <CustomButton
              variant="contained"
              onPress={() => router.push(`/(main)/GroupChat?groupId=${groupId}`)}
              style={styles.chatButton}
            >
              💬 Group Chat
            </CustomButton>
          </View>
        )}
        
        {/* Meetups Section with Create Button */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <CustomButton
              variant="outlined"
              onPress={() => setShowCreateMeetupModal(true)}
              style={styles.createMeetupButton}
            >
              + Create Meetup
            </CustomButton>
          </View>
        </View>
        
        <MeetupsList />

        {group.createdBy === userProfile?.uid && (
          <CustomButton 
            variant="contained" 
            onPress={handleDeleteGroup}
            loading={isDeleting}
            loadingText="Deleting Group..."
            style={{ backgroundColor: colors.error }}
          >
            Delete Group
          </CustomButton>
        )}

        <Button title="Back" onPress={() => router.back()} />
      </ScrollView>

      {/* Meetup Creation Modal */}
      {group && (
        <MeetupCreationModal
          visible={showCreateMeetupModal}
          onClose={() => setShowCreateMeetupModal(false)}
          group={group}
          onMeetupCreated={(newMeetup) => {
            setMeetups(prev => [...prev, newMeetup])
          }}
        />
      )}
    </Page>
  );
}

// DONE! Group chat button added for members only

const styles = StyleSheet.create({
  container: { justifyContent: 'flex-start', alignItems: 'flex-start', padding: 20 },
  title: { marginBottom: 10 },
  description: { marginBottom: 20, lineHeight: 22 },
  section: { width: '100%', marginBottom: 20 },
  sectionTitle: { marginBottom: 10 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  createMeetupButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  chatButton: {
    width: '100%',
    marginBottom: 8,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 },
  subjectsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  subjectChip: { marginBottom: 4 },
  memberRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 4 },
});
