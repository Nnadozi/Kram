import AppearanceModal from '@/components/AppearanceModal'
import CustomText from '@/components/CustomText'
import LanguageModal from '@/components/LanguageModal'
import Page from '@/components/Page'
import { useModal } from '@/hooks/useModal'
import { useThemeStore } from '@/stores/themeStore'
import { router } from 'expo-router'
import { Linking, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { IconButton, useTheme } from 'react-native-paper'
import app from '../../app.config'

interface SettingItemProps {
  title: string
  icon?: string
  subtitle?: string
  iconName?: string
  rightContent?: string
  onPress?: () => void
}

const SettingItem = ({ title, icon, iconName = 'chevron-right', rightContent, onPress }: SettingItemProps) => {
  const {colors} = useTheme();
  return (
    <TouchableOpacity 
      style={[styles.settingItem, {borderBottomColor:colors.outlineVariant}]} 
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.5 : 1}
    >
      <View style={styles.settingItemLeft}>
        {icon && <IconButton iconColor={colors.inverseSurface} icon={icon} size={20} />}
        <CustomText>{title}</CustomText>
      </View>
      {rightContent ? (
        <CustomText style={{paddingVertical: 15,alignSelf: 'center', justifyContent: 'center'}} fontSize='sm' gray>{rightContent}</CustomText>
      ) : (
        <IconButton iconColor={colors.inverseSurface} icon={iconName} size={20} />
      )}
    </TouchableOpacity>
  )
}

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
        <IconButton onPress={() => router.back()} icon='arrow-left' size={20} />
        <CustomText bold fontSize='2xl'>Settings</CustomText>
        {/** Empty view to push the text to the center */}
        <View style={{width: "10%"}}/>
      </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <SettingItem
            title="Appearance"
            icon="theme-light-dark"
            onPress={appearanceModal.open}
          />
          <SettingItem
            title="Language"
            icon="translate"
            onPress={languageModal.open}
          />        
          <SettingItem
            title="Notifications"
            icon="bell"
            onPress={() => handleNavigateToScreen('Notifications')}
          />       
          <SettingItem
            title="Account Settings"
            icon="account-cog"
            onPress={() => handleNavigateToScreen('Account')}
          />        
          <SettingItem
            title="Feedback"
            icon="message-text"
            onPress={() => handleNavigateToScreen('Feedback')}
          />        
          <SettingItem
            title="Privacy Policy"
            icon="shield-check"
            onPress={handlePrivacyPolicy}
          />
          <SettingItem
            title="Version"
            icon="information"
            rightContent={app.expo.version}
          />
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
    marginBottom: 5,
    width: '100%',
  },
  scrollView: {
    width: '100%',
    flex: 1,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    width: '100%',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',

  },
})