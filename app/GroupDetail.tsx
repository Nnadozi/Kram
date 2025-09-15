import CustomText from '@/components/CustomText';
import Page from '@/components/Page';
import { db } from '@/firebase/firebaseConfig';
import { useAsyncOperation } from '@/hooks/useAsyncOperation';
import { useUserStore } from '@/stores/userStore';
import { Group } from '@/types/Group';
import { router, useGlobalSearchParams } from 'expo-router';
import { deleteDoc, doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, View } from 'react-native';
import { Chip, useTheme } from 'react-native-paper';

export default function GroupDetail() {
  const { groupId } = useGlobalSearchParams();
  const [group, setGroup] = useState<Group | null>(null);
  const { colors } = useTheme();
  const { userProfile, setUserProfile } = useUserStore();

  const { execute: fetchGroup, isLoading } = useAsyncOperation({
    onSuccess: (result: Group) => {
      setGroup(result);
    },
    showErrorAlert: false
  });

  const { execute: deleteGroup, isLoading: isDeleting } = useAsyncOperation({
    onSuccess: () => {
      Alert.alert('Success', 'Group deleted successfully!');
      router.back();
    },
    showErrorAlert: true,
    errorMessage: 'Failed to delete group. Please try again.'
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
              
              // Remove from user's groups array
              const updatedGroups = userProfile.groups.filter(g => g.id !== group.id);
              setUserProfile({ groups: updatedGroups });
              
              return { success: true };
            });
          }
        }
      ]
    );
  };

  useEffect(() => {
    if (groupId) {
      fetchGroup(async () => {
        const groupDoc = await getDoc(doc(db, 'groups', groupId as string));
        if (groupDoc.exists()) {
          return { id: groupDoc.id, ...groupDoc.data() } as Group;
        }
        throw new Error('Group not found');
      });
    }
  }, [groupId]);

  if (isLoading) {
    return (
      <Page style={styles.container}>
        <CustomText gray>Loading group...</CustomText>
      </Page>
    );
  }

  if (!group) {
    return (
      <Page style={styles.container}>
        <CustomText gray>Group not found</CustomText>
        <Button title="Back" onPress={() => router.back()} />
      </Page>
    );
  }

  return (
    <Page style={styles.container}>
      <CustomText bold fontSize="xl" style={styles.title}>
        {group.name}
      </CustomText>
      
      <CustomText fontSize="base" style={styles.description}>
        {group.description}
      </CustomText>

      {/* Subjects */}
      {group.subjects && group.subjects.length > 0 && (
        <View style={styles.section}>
          <CustomText bold fontSize="lg" style={styles.sectionTitle}>
            Subjects
          </CustomText>
          <View style={styles.subjectsContainer}>
            {group.subjects.map((subject, index) => (
              <Chip
                key={index}
                style={[styles.subjectChip, { backgroundColor: colors.primaryContainer }]}
                textStyle={{ color: colors.onPrimaryContainer }}
              >
                {subject}
              </Chip>
            ))}
          </View>
        </View>
      )}

      {/* Delete Button - Only show for group creator */}
      {group && userProfile && group.createdBy === userProfile.uid && (
        <View style={styles.buttonContainer}>
          <Button 
            title={isDeleting ? "Deleting..." : "Delete Group"} 
            onPress={handleDeleteGroup}
            color={colors.error}
            disabled={isDeleting}
          />
        </View>
      )}

      <Button title="Back" onPress={() => router.back()} />
    </Page>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 20,
  },
  title: {
    marginBottom: 10,
  },
  description: {
    marginBottom: 20,
    lineHeight: 22,
  },
  section: {
    width: '100%',
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 10,
  },
  subjectsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  subjectChip: {
    marginBottom: 4,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
});
