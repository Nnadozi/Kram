import AppearanceModal from '@/components/AppearanceModal'
import CustomText from '@/components/CustomText'
import LanguageModal from '@/components/LanguageModal'
import Page from '@/components/Page'
import { useModal } from '@/hooks/useModal'
import { useThemeStore } from '@/stores/themeStore'
import { router } from 'expo-router'
import { Linking, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { IconButton } from 'react-native-paper'

const Settings = () => {
  const appearanceModal = useModal()
  const languageModal = useModal()
  const { appearanceMode } = useThemeStore()
  
  // Helper function to get display text for appearance mode
  const getAppearanceDisplayText = (mode: string) => {
    switch (mode) {
      case 'light': return 'Light'
      case 'dark': return 'Dark'
      case 'system': return 'System'
      default: return 'System'
    }
  }

  const handleNavigateToScreen = (screen: string) => {
    router.push(`/(settings)/${screen}` as any)
  }

  const handlePrivacyPolicy = () => {
    // TODO: Replace with actual privacy policy URL
    Linking.openURL('https://example.com/privacy-policy')
  }

  return (
    <Page style={{alignItems: 'flex-start', justifyContent: 'flex-start'}}>
      <View style={styles.topContainer}>
        <IconButton onPress={() => router.back()} icon='chevron-left' size={20} />
        <CustomText bold fontSize='lg'>Settings</CustomText>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <CustomText bold fontSize='lg' style={styles.sectionTitle}>Preferences</CustomText>
          
          <TouchableOpacity style={styles.settingItem} onPress={appearanceModal.open}>
            <View style={styles.settingItemContent}>
              <CustomText>Appearance</CustomText>
              <CustomText fontSize='sm' gray>{getAppearanceDisplayText(appearanceMode)}</CustomText>
            </View>
            <IconButton icon='chevron-right' size={20} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem} onPress={languageModal.open}>
            <CustomText>Language</CustomText>
            <IconButton icon='chevron-right' size={20} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem} onPress={() => handleNavigateToScreen('Notifications')}>
            <CustomText>Notifications</CustomText>
            <IconButton icon='chevron-right' size={20} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <CustomText bold fontSize='lg' style={styles.sectionTitle}>Account</CustomText>
          
          <TouchableOpacity style={styles.settingItem} onPress={() => handleNavigateToScreen('Account')}>
            <CustomText>Account Settings</CustomText>
            <IconButton icon='chevron-right' size={20} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <CustomText bold fontSize='lg' style={styles.sectionTitle}>Support</CustomText>
          
          <TouchableOpacity style={styles.settingItem} onPress={() => handleNavigateToScreen('Help')}>
            <CustomText>Help & Support</CustomText>
            <IconButton icon='chevron-right' size={20} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem} onPress={handlePrivacyPolicy}>
            <CustomText>Privacy Policy</CustomText>
            <IconButton icon='open-in-new' size={20} />
          </TouchableOpacity>
          
        </View>

        <View style={styles.section}>
          <CustomText fontSize='sm' style={styles.versionText}>Version 1.0.0</CustomText>
        </View>
      </ScrollView>

      {/* Modals */}
      <AppearanceModal
        visible={appearanceModal.visible}
        onClose={appearanceModal.close}
      />
      
      <LanguageModal
        visible={languageModal.visible}
        onClose={languageModal.close}
      />
    </Page>
  )
}

export default Settings

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
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingItemContent: {
    flex: 1,
  },
  versionText: {
    color: '#999',
    textAlign: 'center',
    paddingVertical: 8,
  },
})