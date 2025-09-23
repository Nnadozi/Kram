import CustomButton from '@/components/CustomButton'
import CustomInput from '@/components/CustomInput'
import CustomText from '@/components/CustomText'
import Page from '@/components/Page'
import { searchSubjects } from '@/constants/subjects'
import { db } from '@/firebase/firebaseConfig'
import { useAsyncOperation } from '@/hooks/useAsyncOperation'
import { createValidationConfig, useFormValidation } from '@/hooks/useFormValidation'
import { useUserStore } from '@/stores/userStore'
import { Group } from '@/types/Group'
import { validationRules } from '@/util/validation'
import { router } from 'expo-router'
import { collection, doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { useState } from 'react'
import { Alert, FlatList, Modal, StyleSheet, View } from 'react-native'
import { Chip, useTheme } from 'react-native-paper'

interface GroupCreationModalProps {
  visible: boolean
  onClose: () => void
}

const GroupCreationModal = ({ visible, onClose }: GroupCreationModalProps) => {
  const [groupName, setGroupName] = useState('')
  const [groupDescription, setGroupDescription] = useState('')
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [subjectSearch, setSubjectSearch] = useState('')
  const { userProfile, setUserProfile, authUser } = useUserStore()
  const { colors } = useTheme()

  const validationConfig = createValidationConfig.custom({
    groupName: {
      rule: validationRules.groupName,
      errorMessage: 'Group name must be 3-50 characters'
    },
    groupDescription: {
      rule: validationRules.groupDescription,
      errorMessage: 'Description must be 10-500 characters'
    },
    subjects: {
      rule: (value: string[]) => value.length > 0,
      errorMessage: 'Please select at least one subject'
    }
  })

  const { validateForm, showValidationAlert } = useFormValidation(validationConfig)

  const handleSubjectSelect = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter(s => s !== subject))
    } else {
      setSelectedSubjects([...selectedSubjects, subject])
      setSubjectSearch('') // Clear the search input
    }
  }

  const filteredSubjects = searchSubjects(subjectSearch)

  const { execute: createGroup, isLoading: isCreating } = useAsyncOperation({
    onSuccess: (result: Group) => {
      Alert.alert('Success', 'Group created successfully!')
      router.push({
        pathname:'/(main)/GroupDetail',
        params: {
          groupId: result.id
        }
      })
      handleClose()
    },
    showErrorAlert: true,
    errorMessage: 'Failed to create group. Please try again.'
  })

  const handleCreateGroup = () => {
    const formData = {
      groupName: groupName.trim(),
      groupDescription: groupDescription.trim(),
      subjects: selectedSubjects
    }

    if (!validateForm(formData)) {
      if (!validationRules.groupName(groupName.trim())) {
        showValidationAlert('groupName')
        return
      }
      if (!validationRules.groupDescription(groupDescription.trim())) {
        showValidationAlert('groupDescription')
        return
      }
      if (selectedSubjects.length === 0) {
        showValidationAlert('subjects')
        return
      }
    }

    // Check authentication - use authUser.uid as fallback if userProfile.uid is not available
    const userId = userProfile?.uid || authUser?.uid
    if (!userId) {
      Alert.alert('Error', 'User not authenticated')
      return
    }

    createGroup(async () => {
      const groupRef = doc(collection(db, 'groups'))
      const groupId = groupRef.id
      
      const newGroupForArray: Group = {
        id: groupId,
        name: groupName.trim(),
        description: groupDescription.trim(),
        members: [userId], // Use the userId we determined above
        subjects: selectedSubjects,
        meetups: [],
        createdBy: userId,
        createdAt: new Date(), 
        updatedAt: new Date()   
      }

      const newGroupForFirestore = {
        ...newGroupForArray,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      await setDoc(groupRef, newGroupForFirestore)

      // Update user profile with new group if userProfile exists
      if (userProfile) {
        const updatedGroups = [...(userProfile.groups || []), groupId]
        setUserProfile({
          groups: updatedGroups
        })
      }

      return newGroupForArray
    })
  }

  const handleClose = () => {
    setGroupName('')
    setGroupDescription('')
    setSelectedSubjects([])
    setSubjectSearch('')
    onClose()
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <Page style={{ justifyContent: 'flex-start', alignItems: 'flex-start' }}>
        <CustomText bold fontSize="xl"> New Group</CustomText>
        <View style={styles.form}>
          <CustomInput
            label="Group Name"
            value={groupName}
            onChangeText={setGroupName}
            placeholder="Enter group name"
            maxLength={50}
          />
          <CustomInput
            value={groupDescription}
            onChangeText={setGroupDescription}
            placeholder="Enter group description"
            multiline
            style={styles.descriptionInput}
            showCharCounter={true}
            maxLength={200}
          />

          {/* Subjects Section */}
          <View style={styles.section}>
            <CustomText bold fontSize="sm" gray>Subject(s)</CustomText>
            
            {/* Selected Subjects */}
            {selectedSubjects.length > 0 && (
              <View style={styles.selectedContainer}>
                {selectedSubjects.map((subject, index) => (
                  <Chip
                    key={index}
                    onClose={() => setSelectedSubjects(selectedSubjects.filter(s => s !== subject))}
                    style={{ backgroundColor: colors.primary }}
                    textStyle={{ color: colors.onPrimary }}
                  >
                    {subject}
                  </Chip>
                ))}
              </View>
            )}
            
            {/* Subject Search */}
            <CustomInput
              placeholder="Search subjects..."
              onChangeText={setSubjectSearch}
              value={subjectSearch}
            />
            
            {/* Subject Options */}
            {subjectSearch.length > 0 && (
              <View style={{ marginVertical: 5 }}>
                <FlatList
                  data={filteredSubjects.slice(0, 10)}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <Chip
                      selected={selectedSubjects.includes(item)}
                      onPress={() => handleSubjectSelect(item)}
                      style={{ 
                        backgroundColor: selectedSubjects.includes(item) ? colors.primary : colors.surfaceVariant,
                        marginRight: 8
                      }}
                      textStyle={{ color: selectedSubjects.includes(item) ? colors.onPrimary : colors.onSurfaceVariant }}
                    >
                      {item}
                    </Chip>
                  )}
                />
              </View>
            )}
          </View>
          <View style={styles.buttonsContainer}>


            <CustomButton
              variant="contained"
              onPress={handleCreateGroup}
              loading={isCreating}
              disabled={!groupName.trim() || !groupDescription.trim() || selectedSubjects.length === 0}
              loadingText="Creating Group..."
              style={styles.createButton}
            >
              Create Group
            </CustomButton>
            <CustomButton
              variant="outlined"
              onPress={handleClose}
              style={styles.cancelButton}
            >
              Cancel
            </CustomButton>
          </View>
        </View>
      </Page>
    </Modal>
  )
}

export default GroupCreationModal

const styles = StyleSheet.create({
  form: {
    width: '100%',
    gap: 10,
    marginTop: 10,
  },
  descriptionInput: {
    height: 100,
  },
  section: {
    gap: 10,
  },
  selectedContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  buttonsContainer: {
    justifyContent: 'space-between',
    gap: 15,
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
  },
  createButton: {
    flex: 1,
  },
})
