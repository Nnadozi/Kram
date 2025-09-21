import CustomText from '@/components/CustomText'
import Page from '@/components/Page'
import { router } from 'expo-router'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { IconButton } from 'react-native-paper'

const Help = () => {
  const handleContactSupport = () => {
    // TODO: Open email or contact form
    console.log('Contact support pressed')
  }

  const handleFAQ = () => {
    // TODO: Navigate to FAQ section
    console.log('FAQ pressed')
  }

  return (
    <Page style={{alignItems: 'flex-start', justifyContent: 'flex-start'}}>
      <View style={styles.topContainer}>
        <IconButton onPress={() => router.back()} icon='chevron-left' size={20} />
        <CustomText bold fontSize='lg'>Help & Support</CustomText>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <CustomText bold fontSize='lg' style={styles.sectionTitle}>Getting Started</CustomText>
          
          <TouchableOpacity style={styles.helpItem}>
            <CustomText>How to create a group</CustomText>
            <IconButton icon='chevron-right' size={20} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.helpItem}>
            <CustomText>How to join a group</CustomText>
            <IconButton icon='chevron-right' size={20} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.helpItem}>
            <CustomText>Setting up your profile</CustomText>
            <IconButton icon='chevron-right' size={20} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <CustomText bold fontSize='lg' style={styles.sectionTitle}>Troubleshooting</CustomText>
          
          <TouchableOpacity style={styles.helpItem}>
            <CustomText>App not loading</CustomText>
            <IconButton icon='chevron-right' size={20} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.helpItem}>
            <CustomText>Notifications not working</CustomText>
            <IconButton icon='chevron-right' size={20} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.helpItem}>
            <CustomText>Login issues</CustomText>
            <IconButton icon='chevron-right' size={20} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <CustomText bold fontSize='lg' style={styles.sectionTitle}>Support</CustomText>
          
          <TouchableOpacity style={styles.helpItem} onPress={handleFAQ}>
            <CustomText>Frequently Asked Questions</CustomText>
            <IconButton icon='chevron-right' size={20} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.helpItem} onPress={handleContactSupport}>
            <CustomText>Contact Support</CustomText>
            <IconButton icon='chevron-right' size={20} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.helpItem}>
            <CustomText>Report a Bug</CustomText>
            <IconButton icon='chevron-right' size={20} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <CustomText bold fontSize='lg' style={styles.sectionTitle}>Resources</CustomText>
          
          <TouchableOpacity style={styles.helpItem}>
            <CustomText>Community Guidelines</CustomText>
            <IconButton icon='chevron-right' size={20} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.helpItem}>
            <CustomText>Safety Tips</CustomText>
            <IconButton icon='chevron-right' size={20} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Page>
  )
}

export default Help

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
  helpItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
})
