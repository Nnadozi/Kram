import CustomInput from '@/components/CustomInput'
import CustomText from '@/components/CustomText'
import OnboardingPage from '@/components/OnboardingPage'
import { searchAcademicFields } from '@/constants/majorsMinors'
import { createValidationConfig, useFormValidation } from '@/hooks/useFormValidation'
import { useUserStore } from '@/stores/userStore'
import { validationRules } from '@/util/validation'
import { router } from 'expo-router'
import { useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { Chip, useTheme } from 'react-native-paper'

const ProfileSetupTwo = () => {
  const { setUserProfile } = useUserStore()
  const [selectedMajors, setSelectedMajors] = useState<string[]>([])
  const [selectedMinors, setSelectedMinors] = useState<string[]>([])
  const [majorSearch, setMajorSearch] = useState('')
  const [minorSearch, setMinorSearch] = useState('')
  const [bio, setBio] = useState('')
  const [avatar, setAvatar] = useState('')
  const handleMajorSelect = (major: string) => {
    if (selectedMajors.includes(major)) {
      setSelectedMajors(selectedMajors.filter(m => m !== major))
    } else {
      setSelectedMajors([...selectedMajors, major])
      setMajorSearch('') // Clear the search input
    }
  }

  const handleMinorSelect = (minor: string) => {
    if (selectedMinors.includes(minor)) {
      setSelectedMinors(selectedMinors.filter(m => m !== minor))
    } else {
      setSelectedMinors([...selectedMinors, minor])
      setMinorSearch('') // Clear the search input
    }
  }

  // Form validation configuration using your validation hooks
  const validationConfig = createValidationConfig.custom({
    majors: {
      rule: (value: string[]) => value.length > 0,
      errorMessage: 'Please select at least one major'
    },
    bio: {
      rule: validationRules.bio,
      errorMessage: 'Bio must be less than 500 characters'
    }
  })

  const { validateForm, showValidationAlert } = useFormValidation(validationConfig)

  const isFormValid = () => {
    return selectedMajors.length > 0 && validationRules.bio(bio)
  }

  const handleButtonPress = () => {
    const formData = {
      majors: selectedMajors,
      bio: bio
    }

    if (!validateForm(formData)) {
      // Show specific validation errors
      if (selectedMajors.length === 0) {
        showValidationAlert('majors')
        return
      }
      if (!validationRules.bio(bio)) {
        showValidationAlert('bio')
        return
      }
    }

    setUserProfile({
      majors: selectedMajors,
      minors: selectedMinors,
      bio: bio,
      avatar: avatar,
    })
    router.navigate('/(onboarding)/EnableNotifications')
  }
  const filteredMajors = searchAcademicFields(majorSearch)
  const filteredMinors = searchAcademicFields(minorSearch)
  const { colors } = useTheme()

  return (
    <OnboardingPage 
    title='A Few More Details' 
    description="Finish setting up your profile"
    progress={0.5} 
    buttonDisabled={!isFormValid()}
    onButtonPress={handleButtonPress}
    >
      <View style={styles.container}> 
        {/* Majors Section */}
        <View style={styles.section}>
          <CustomText bold fontSize="sm" gray>Major(s)</CustomText>
          
          {/* Selected Majors */}
          {selectedMajors.length > 0 && (
            <View style={styles.selectedContainer}>
              {selectedMajors.map((major, index) => (
                <Chip
                  key={index}
                  onClose={() => setSelectedMajors(selectedMajors.filter(m => m !== major))}
                  style={{ backgroundColor: colors.primary }}
                  textStyle={{ color: colors.onPrimary }}
                >
                  {major}
                </Chip>
              ))}
            </View>
          )}
          
          {/* Major Search */}
          <CustomInput
            placeholder="Search majors..."
            onChangeText={setMajorSearch}
            value={majorSearch}
          />
          
          {/* Major Options */}
          {majorSearch.length > 0 && (
            <View style={{ marginVertical: 5 }}>
              <FlatList
                data={filteredMajors.slice(0, 10)}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <Chip
                    selected={selectedMajors.includes(item)}
                    onPress={() => handleMajorSelect(item)}
                    style={{ 
                      backgroundColor: selectedMajors.includes(item) ? colors.primary : colors.surfaceVariant,
                      marginRight: 8
                    }}
                    textStyle={{ color: selectedMajors.includes(item) ? colors.onPrimary : colors.onSurfaceVariant }}
                  >
                    {item}
                  </Chip>
                )}
              />
            </View>
          )}
          
        </View>

        {/* Minors Section */}
        <View style={styles.section}>
          <CustomText bold fontSize="sm" gray>Minor(s) (Optional)</CustomText>
          
          {/* Selected Minors */}
          {selectedMinors.length > 0 && (
            <View style={styles.selectedContainer}>
              {selectedMinors.map((minor, index) => (
                <Chip
                  key={index}
                  onClose={() => setSelectedMinors(selectedMinors.filter(m => m !== minor))}
                  style={{ backgroundColor: colors.primary }}
                  textStyle={{ color: colors.onPrimary }}
                >
                  {minor}
                </Chip>
              ))}
            </View>
          )}
          
          {/* Minor Search */}
          <CustomInput
            placeholder="Search minors..."
            onChangeText={setMinorSearch}
            value={minorSearch}
          />
          
          {/* Minor Options */}
          {minorSearch.length > 0 && (
            <View style={{ marginVertical: 5 }}>
              <FlatList
                data={filteredMinors.slice(0, 10)}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <Chip
                    selected={selectedMinors.includes(item)}
                    onPress={() => handleMinorSelect(item)}
                    style={{ 
                      backgroundColor: selectedMinors.includes(item) ? colors.primary : colors.surfaceVariant,
                      marginRight: 8
                    }}
                    textStyle={{ color: selectedMinors.includes(item) ? colors.onPrimary : colors.onSurfaceVariant }}
                  >
                    {item}
                  </Chip>
                )}
              />
            </View>
          )}
          
        </View>

        {/* Bio Section */}
        <CustomInput
          placeholder='Short Bio'
          value={bio}
          onChangeText={setBio}
          maxLength={200}
          style={styles.bioInput}
          multiline
          showCharCounter
        />
      </View>
    </OnboardingPage>
  )
}

export default ProfileSetupTwo

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 5,
    gap: 20,
    flex: 1,
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
  bioInput: {
    height: 100,
  },
})