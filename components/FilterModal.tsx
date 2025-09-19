import CustomText from '@/components/CustomText'
import { subjects } from '@/constants/subjects'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Button, Chip, Modal, Portal, useTheme } from 'react-native-paper'

interface FilterModalProps {
  visible: boolean
  onClose: () => void
  
  // Filter states
  sortBy: 'name' | 'date' | 'members'
  setSortBy: (value: 'name' | 'date' | 'members') => void
  selectedSubjects: string[]
  setSelectedSubjects: (value: string[]) => void
  
  // Actions
  onClearFilters: () => void
}

/**
 * Filter Modal Component
 * 
 * Clean, simple modal for filtering groups with:
 * - Sort options (Name, Newest, Popular)
 * - Subject filtering with all available subjects
 * - Clear and Apply actions
 */
const FilterModal = ({
  visible,
  onClose,
  sortBy,
  setSortBy,
  selectedSubjects,
  setSelectedSubjects,
  onClearFilters
}: FilterModalProps) => {
  const { colors } = useTheme()

  const toggleSubject = (subject: string) => {
    setSelectedSubjects(
      selectedSubjects.includes(subject)
        ? selectedSubjects.filter(s => s !== subject)
        : [...selectedSubjects, subject]
    )
  }

  const handleClear = () => {
    onClearFilters()
  }

  return (
    <Portal>
      <Modal 
        visible={visible} 
        onDismiss={onClose} 
        contentContainerStyle={[styles.modal, { backgroundColor: colors.surface }]}
      >
        <CustomText bold fontSize="xl">Filters</CustomText>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Sort Section */}
          <View style={styles.section}>
            <CustomText bold fontSize="base" style={styles.sectionTitle}>
              Sort By
            </CustomText>
            <View style={styles.sortOptions}>
              <Chip 
                selected={sortBy === 'name'} 
                onPress={() => setSortBy('name')}
                style={styles.sortChip}
              >
                Name (A-Z)
              </Chip>
              <Chip 
                selected={sortBy === 'date'} 
                onPress={() => setSortBy('date')}
                style={styles.sortChip}
              >
                Newest First
              </Chip>
              <Chip 
                selected={sortBy === 'members'} 
                onPress={() => setSortBy('members')}
                style={styles.sortChip}
              >
                Most Popular
              </Chip>
            </View>
          </View>

          {/* Subjects Section */}
          <View style={styles.section}>
            <CustomText bold fontSize="base" style={styles.sectionTitle}>
              Subjects {selectedSubjects.length > 0 && `(${selectedSubjects.length} selected)`}
            </CustomText>
            <View style={styles.subjectsGrid}>
              {subjects.map(subject => (
                <Chip 
                  key={subject} 
                  selected={selectedSubjects.includes(subject)} 
                  onPress={() => toggleSubject(subject)}
                  style={styles.subjectChip}
                  compact
                >
                  {subject}
                </Chip>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Footer Actions */}
        <View style={styles.footer}>
          <Button 
            mode="outlined" 
            onPress={handleClear}
            style={styles.footerButton}
          >
            Clear All
          </Button>
          <Button 
            mode="contained" 
            onPress={onClose}
            style={styles.footerButton}
          >
            Apply
          </Button>
        </View>
      </Modal>
    </Portal>
  )
}

export default FilterModal

const styles = StyleSheet.create({
  modal: {
    margin: 20,
    borderRadius: 10,
    padding: 20,
  },
  content: {
    maxHeight: 400,
  },
  section: {
    padding: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  sortOptions: {
    gap: 8,
  },
  sortChip: {
    marginBottom: 8,
  },
  subjectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  subjectChip: {
    marginBottom: 4,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  footerButton: {
    flex: 1,
  },
})