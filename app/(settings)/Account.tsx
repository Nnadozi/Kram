import CustomButton from '@/components/CustomButton'
import CustomText from '@/components/CustomText'
import Page from '@/components/Page'
import { useUserStore } from '@/stores/userStore'
import { router } from 'expo-router'
import { ScrollView, StyleSheet, View } from 'react-native'
import { IconButton, Switch } from 'react-native-paper'

const Account = () => {
  const { signOut } = useUserStore()

  const handleSignOut = () => {
    // TODO: Add confirmation dialog
    signOut()
  }

  const handleDeleteAccount = () => {
    // TODO: Add confirmation dialog and delete account logic
    console.log('Delete account pressed')
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
            >
              Delete Account
            </CustomButton>
          </View>
        </View>
      </ScrollView>
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
