import CustomText from '@/components/CustomText'
import Page from '@/components/Page'
import { router } from 'expo-router'
import { ScrollView, StyleSheet, View } from 'react-native'
import { IconButton, Switch } from 'react-native-paper'

const Notifications = () => {
  return (
    <Page style={{alignItems: 'flex-start', justifyContent: 'flex-start'}}>
      <View style={styles.topContainer}>
        <IconButton onPress={() => router.back()} icon='chevron-left' size={20} />
        <CustomText bold fontSize='lg'>Notifications</CustomText>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <CustomText bold fontSize='lg' style={styles.sectionTitle}>Push Notifications</CustomText>
          
          <View style={styles.settingRow}>
            <CustomText>New group invites</CustomText>
            <Switch value={true} onValueChange={() => {}} />
          </View>
          
          <View style={styles.settingRow}>
            <CustomText>Meetup reminders</CustomText>
            <Switch value={true} onValueChange={() => {}} />
          </View>
          
          <View style={styles.settingRow}>
            <CustomText>Group updates</CustomText>
            <Switch value={false} onValueChange={() => {}} />
          </View>
        </View>

        <View style={styles.section}>
          <CustomText bold fontSize='lg' style={styles.sectionTitle}>Email Notifications</CustomText>
          
          <View style={styles.settingRow}>
            <CustomText>Weekly digest</CustomText>
            <Switch value={true} onValueChange={() => {}} />
          </View>
          
          <View style={styles.settingRow}>
            <CustomText>Important updates</CustomText>
            <Switch value={true} onValueChange={() => {}} />
          </View>
        </View>

        <View style={styles.section}>
          <CustomText bold fontSize='lg' style={styles.sectionTitle}>Quiet Hours</CustomText>
          
          <View style={styles.settingRow}>
            <CustomText>Enable quiet hours</CustomText>
            <Switch value={false} onValueChange={() => {}} />
          </View>
          
          <View style={styles.settingRow}>
            <CustomText>Start time: 10:00 PM</CustomText>
            <IconButton icon='chevron-right' size={20} />
          </View>
          
          <View style={styles.settingRow}>
            <CustomText>End time: 8:00 AM</CustomText>
            <IconButton icon='chevron-right' size={20} />
          </View>
        </View>
      </ScrollView>
    </Page>
  )
}

export default Notifications

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
})
