import CustomButton from '@/components/CustomButton'
import CustomText from '@/components/CustomText'
import GroupCreationModal from '@/components/GroupCreationModal'
import Page from '@/components/Page'
import { useState } from 'react'
import { StyleSheet } from 'react-native'

const Discover = () => {
  const [showCreateModal, setShowCreateModal] = useState(false)

  return (
    <Page style={{ justifyContent: 'flex-start', alignItems: 'flex-start' }}>
      <CustomText bold fontSize='2xl' style={styles.title}>Discover</CustomText>
      
      <CustomButton
        variant="contained"
        onPress={() => setShowCreateModal(true)}
        style={styles.createButton}
      >
        Create Group
      </CustomButton>

      <GroupCreationModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </Page>
  )
}

export default Discover

const styles = StyleSheet.create({
  title: {
    marginBottom: 30,
  },
  createButton: {
    width: '80%',
  },
})