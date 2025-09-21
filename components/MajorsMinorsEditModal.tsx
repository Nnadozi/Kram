import CustomButton from '@/components/CustomButton'
import CustomInput from '@/components/CustomInput'
import CustomText from '@/components/CustomText'
import Page from '@/components/Page'
import { academicFields } from '@/constants/majorsMinors'
import { useFormValidation } from '@/hooks/useFormValidation'
import { useUserStore } from '@/stores/userStore'
import { useState } from 'react'
import { Alert, FlatList, Modal, StyleSheet, TouchableOpacity, View } from 'react-native'
import { useTheme } from 'react-native-paper'

interface MajorsMinorsEditModalProps {
  visible: boolean
  onClose: () => void
}

interface FieldItem {
  id: string
  name: string
  selected: boolean
}

const MajorsMinorsEditModal = ({ visible, onClose }: MajorsMinorsEditModalProps) => {
  const { userProfile, setUserProfile } = useUserStore()
  const { colors } = useTheme()
  const [majors, setMajors] = useState<string[]>(userProfile?.majors || [])
  const [minors, setMinors] = useState<string[]>(userProfile?.minors || [])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'majors' | 'minors'>('majors')

  // Form validation
  const validationConfig = {
    majors: {
      rule: (value: string): boolean => Boolean(value && value.trim().length > 0),
      errorMessage: 'At least one major is required'
    }
  }
  const { getFieldError } = useFormValidation(validationConfig)

  // Filter academic fields based on search query
  const filteredFields = academicFields.filter(field =>
    field.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Create field items with selection state
  const getFieldItems = (selectedFields: string[]): FieldItem[] => {
    return filteredFields.map(field => ({
      id: field,
      name: field,
      selected: selectedFields.includes(field)
    }))
  }

  // Handle field selection/deselection
  const toggleField = (fieldName: string) => {
    if (activeTab === 'majors') {
      setMajors(prev => 
        prev.includes(fieldName) 
          ? prev.filter(f => f !== fieldName)
          : [...prev, fieldName]
      )
    } else {
      setMinors(prev => 
        prev.includes(fieldName) 
          ? prev.filter(f => f !== fieldName)
          : [...prev, fieldName]
      )
    }
  }

  // Handle save
  const handleSave = () => {
    // Validate majors (at least one required)
    const majorsError = getFieldError('majors', majors.join(', '))
    
    if (majorsError) {
      Alert.alert('Validation Error', majorsError)
      return
    }

    // Check if there are changes
    const majorsChanged = JSON.stringify(majors.sort()) !== JSON.stringify((userProfile?.majors || []).sort())
    const minorsChanged = JSON.stringify(minors.sort()) !== JSON.stringify((userProfile?.minors || []).sort())

    if (majorsChanged || minorsChanged) {
      setUserProfile({ 
        majors: majors, 
        minors: minors 
      })
      Alert.alert('Success', 'Academic information updated successfully!')
    }
    onClose()
  }

  // Handle modal close
  const handleClose = () => {
    setMajors(userProfile?.majors || [])
    setMinors(userProfile?.minors || [])
    setSearchQuery('')
    setActiveTab('majors')
    onClose()
  }

  // Render field item
  const renderFieldItem = ({ item }: { item: FieldItem }) => (
    <TouchableOpacity
      style={[
        styles.fieldItem,
        item.selected && { backgroundColor: colors.primaryContainer }
      ]}
      onPress={() => toggleField(item.name)}
    >
      <CustomText
        style={{
          ...styles.fieldText,
          ...(item.selected && { color: colors.onPrimaryContainer })
        }}
      >
        {item.name}
      </CustomText>
      {item.selected && (
        <CustomText style={{ color: colors.onPrimaryContainer }}>✓</CustomText>
      )}
    </TouchableOpacity>
  )

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <Page style={{ justifyContent: 'flex-start', alignItems: 'flex-start' }}>
        {/* Header */}
        <View style={styles.modalHeader}>
          <CustomText style={{ flex: 1 }} bold fontSize="xl">
            Edit Academic Info
          </CustomText>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <CustomText fontSize="lg">✕</CustomText>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Tab Selector */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'majors' && { backgroundColor: colors.primary }
              ]}
              onPress={() => setActiveTab('majors')}
            >
              <CustomText
                style={{
                  ...styles.tabText,
                  ...(activeTab === 'majors' && { color: colors.onPrimary })
                }}
              >
                Majors ({majors.length})
              </CustomText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'minors' && { backgroundColor: colors.primary }
              ]}
              onPress={() => setActiveTab('minors')}
            >
              <CustomText
                style={{
                  ...styles.tabText,
                  ...(activeTab === 'minors' && { color: colors.onPrimary })
                }}
              >
                Minors ({minors.length})
              </CustomText>
            </TouchableOpacity>
          </View>

          {/* Search Input */}
          <CustomInput
            label="Search fields"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={`Search ${activeTab}...`}
            style={styles.searchInput}
          />

          {/* Selected Fields Summary */}
          <View style={styles.selectedSummary}>
            <CustomText bold fontSize="sm">
              Selected {activeTab}: 
            </CustomText>
            <CustomText fontSize="sm" gray numberOfLines={2}>
              {activeTab === 'majors' 
                ? majors.join(', ') || 'None selected'
                : minors.join(', ') || 'None selected'
              }
            </CustomText>
          </View>

          {/* Fields List */}
          <View style={styles.listContainer}>
            <CustomText bold fontSize="sm" style={styles.listTitle}>
              Available {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} ({filteredFields.length})
            </CustomText>
            <FlatList
              data={getFieldItems(activeTab === 'majors' ? majors : minors)}
              renderItem={renderFieldItem}
              keyExtractor={(item) => item.id}
              style={styles.fieldsList}
              showsVerticalScrollIndicator={false}
              initialNumToRender={20}
              maxToRenderPerBatch={10}
              windowSize={10}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <CustomButton
              variant="outlined"
              onPress={handleClose}
              style={styles.cancelButton}
            >
              Cancel
            </CustomButton>
            <CustomButton
              onPress={handleSave}
              style={styles.saveButton}
              disabled={majors.length === 0}
            >
              Save Changes
            </CustomButton>
          </View>
        </View>
      </Page>
    </Modal>
  )
}

export default MajorsMinorsEditModal

const styles = StyleSheet.create({
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingRight: 8,
  },
  closeButton: {
    padding: 8,
    marginLeft: 8,
  },
  content: {
    width: '100%',
    gap: 16,
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  searchInput: {
    marginBottom: 8,
  },
  selectedSummary: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: 12,
    borderRadius: 8,
    gap: 4,
  },
  listContainer: {
    flex: 1,
    gap: 8,
  },
  listTitle: {
    marginBottom: 4,
  },
  fieldsList: {
    flex: 1,
  },
  fieldItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 8,
    marginBottom: 4,
  },
  fieldText: {
    flex: 1,
    fontSize: 14,
  },
  actionButtons: {
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    width: '100%',
  },
  saveButton: {
    width: '100%',
  },
})

// DONE!
