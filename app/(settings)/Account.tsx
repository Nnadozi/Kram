import CustomButton from '@/components/CustomButton'
import CustomText from '@/components/CustomText'
import DeleteAccountModal from '@/components/DeleteAccountModal'
import Page from '@/components/Page'
import { useModal } from '@/hooks/useModal'
import { useUserStore } from '@/stores/userStore'
import { router } from 'expo-router'
import { Alert, ScrollView, StyleSheet, View } from 'react-native'
import { IconButton, Switch } from 'react-native-paper'

const Account = () => {
  const { signOut, deleteAccount, isLoading, setPendingAccountDeletion } = useUserStore()
  const deleteModal = useModal()

  const handleSignOut = () => {
    // TODO: Add confirmation dialog
    signOut()
  }

  // DONE! Delete account functionality with simplified re-authentication flow

  const handleDeleteAccount = () => {
    deleteModal.open()
  }

  const confirmDeleteAccount = async () => {
    try {
      await deleteAccount()
      deleteModal.close()
    } catch (error) {
      // Check if re-authentication is required
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      if (errorMessage.includes('sign in again') || errorMessage.includes('re-authenticate')) {
        deleteModal.close()
        
        // Show alert and navigate to sign-in
        Alert.alert(
          'Re-authentication Required',
          'For security reasons, please sign in again to delete your account.',
          [
            {
              text: 'Cancel',
              style: 'cancel'
            },
            {
              text: 'Sign In',
              onPress: () => {
                // Set flag to indicate account deletion is pending
                setPendingAccountDeletion(true)
                // Navigate to sign-in screen
                router.push('/(auth)')
              }
            }
          ]
        )
      } else {
        // Other errors are handled in the store
        console.error('Delete account error:', error)
      }
    }
  }

  return (
    <Page style={{alignItems: 'flex-start', justifyContent: 'flex-start'}}>
      <View style={styles.topContainer}>
        <IconButton onPress={() => router.back()} icon='chevron-left' size={20} />
        <CustomText bold fontSize='lg'>Account</CustomText>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <CustomText bold fontSize='lg' style={styles.sectionTitle}>Privacy & Visibility</CustomText>
          
          <View style={styles.settingRow}>
            <CustomText>Profile visibility</CustomText>
            <Switch value={true} onValueChange={() => {}} />
          </View>
          
          <View style={styles.settingRow}>
            <CustomText>Show in group discovery</CustomText>
            <Switch value={true} onValueChange={() => {}} />
          </View>
          
          <View style={styles.settingRow}>
            <CustomText>Allow group invites</CustomText>
            <Switch value={true} onValueChange={() => {}} />
          </View>
        </View>

        <View style={styles.section}>
          <CustomText bold fontSize='lg' style={styles.sectionTitle}>Data & Storage</CustomText>
          
          <View style={styles.settingRow}>
            <CustomText>Download my data</CustomText>
            <IconButton icon='chevron-right' size={20} />
          </View>
          
          <View style={styles.settingRow}>
            <CustomText>Clear cache</CustomText>
            <IconButton icon='chevron-right' size={20} />
          </View>
        </View>

        <View style={styles.section}>
          <CustomText bold fontSize='lg' style={styles.sectionTitle}>Account Actions</CustomText>
          
          <View style={styles.buttonContainer}>
            <CustomButton 
              variant="outlined" 
              onPress={handleSignOut}
              style={styles.actionButton}
            >
              Sign Out
            </CustomButton>
          </View>
          
          <View style={styles.buttonContainer}>
            <CustomButton 
              variant="outlined" 
              onPress={handleDeleteAccount}
              style={[styles.actionButton, styles.deleteButton]}
              disabled={isLoading}
            >
              Delete Account
            </CustomButton>
          </View>
        </View>
      </ScrollView>

      <DeleteAccountModal
        visible={deleteModal.visible}
        onClose={deleteModal.close}
        onConfirm={confirmDeleteAccount}
        isLoading={isLoading}
      />
    </Page>
  )
}

export default Account

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  scrollView: {
    width: '100%',
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
    color: '#666',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  buttonContainer: {
    marginBottom: 12,
  },
  actionButton: {
    width: '100%',
  },
  deleteButton: {
    borderColor: '#ff4444',
  },
})
