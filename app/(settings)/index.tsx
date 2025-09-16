import CustomText from '@/components/CustomText'
import Page from '@/components/Page'
import { router } from 'expo-router'
import { StyleSheet, View } from 'react-native'
import { IconButton } from 'react-native-paper'

const Settings = () => {
  return (
    <Page style={{alignItems: 'flex-start', justifyContent: 'flex-start'}}>
      <View style={styles.topContainer}>
        <IconButton onPress={() => router.back()} icon='chevron-left' size={20} />
        <CustomText bold fontSize='lg'>Settings</CustomText>
      </View>
      <CustomText>Appearance</CustomText>
      <CustomText>Language</CustomText>
      <CustomText>Notifications</CustomText>
      <CustomText>Privacy</CustomText>
      <CustomText>Help</CustomText>
      <CustomText>About</CustomText>
      <CustomText>Logout</CustomText>
      <CustomText>Delete Account</CustomText>
      <CustomText>Version 1.0.0</CustomText>
    </Page>
  )
}

export default Settings

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
})