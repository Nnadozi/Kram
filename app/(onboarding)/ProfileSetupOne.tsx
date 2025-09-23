import CustomInput from '@/components/CustomInput'
import CustomText from '@/components/CustomText'
import OnboardingPage from '@/components/OnboardingPage'
import { searchColleges } from '@/constants/colleges'
import { createValidationConfig, useFormValidation } from '@/hooks/useFormValidation'
import { useUserStore } from '@/stores/userStore'
import { validationRules } from '@/util/validation'
import { router } from 'expo-router'
import { useState } from 'react'
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import { useTheme } from 'react-native-paper'


const ProfileSetupOne = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [school, setSchool] = useState('')
  const [schoolSearch, setSchoolSearch] = useState('')
  const [showSchoolList, setShowSchoolList] = useState(false)
  const [graduationYear, setGraduationYear] = useState('')
  const { setUserProfile } = useUserStore()
  const colors = useTheme().colors
  const filteredSchools = searchColleges(schoolSearch)
  
  const handleSchoolSelect = (selectedSchool: string) => {
    setSchool(selectedSchool)
    setSchoolSearch(selectedSchool)
    setShowSchoolList(false)
  }
  
  const validationConfig = createValidationConfig.custom({
    firstName: {
      rule: validationRules.firstName,
      errorMessage: 'First name must be 2-50 characters'
    },
    lastName: {
      rule: validationRules.lastName,
      errorMessage: 'Last name must be 2-50 characters'
    },
    school: {
      rule: (value: string) => value.trim().length >= 2,
      errorMessage: 'Please select a school'
    },
    graduationYear: {
      rule: (value: string) => {
        if (!value || value.length !== 4) return false;
        const year = parseInt(value);
        return !isNaN(year) && year >= 2025 && year <= 3000;
      },
      errorMessage: 'Please enter a 4-digit graduation year between 2025-3000'
    }
  })

  const { validateForm, showValidationAlert } = useFormValidation(validationConfig)
  
  const handleButtonPress = () => {
    const formData = {
      firstName,
      lastName,
      school,
      graduationYear
    }

    if (!validateForm(formData)) {
      if (!validationRules.firstName(firstName)) {
        showValidationAlert('firstName')
        return
      }
      if (!validationRules.lastName(lastName)) {
        showValidationAlert('lastName')
        return
      }
      if (!validationRules.school(school)) {
        showValidationAlert('school')
        return
      }
      if (!validationConfig.graduationYear.rule(graduationYear)) {
        showValidationAlert('graduationYear')
        return
      }
    }

    setUserProfile({
      firstName: firstName,
      lastName: lastName,
      school: school,
      graduationYear: parseInt(graduationYear) || 0,
    })
    router.navigate('/(onboarding)/ProfileSetupTwo')
  }
  return (
    <OnboardingPage 
    title='Welcome to Kram! ' 
    description="Let's get you set up with your profile"
    progress={0.25} 
    onButtonPress={handleButtonPress}
    >
      <View style={{width: "100%", marginTop: 5, gap: 5, flex: 1}}> 
        <CustomInput
          placeholder='First Name'
          label='First Name'
          value={firstName}
          onChangeText={setFirstName}
          maxLength={50}
        />
        <CustomInput
          placeholder='Last Name'
          label='Last Name'
          value={lastName}
          onChangeText={setLastName}
          maxLength={50}
        />
        <View>
          <CustomInput
            placeholder='Search for your school...'
            label='School/University'
            value={schoolSearch}
            onChangeText={(text) => {
              setSchoolSearch(text)
              setShowSchoolList(true)
            }}
            onFocus={() => setShowSchoolList(true)}
          />
          {showSchoolList && (
            <View style={[styles.schoolList, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
              <FlatList
                data={filteredSchools.slice(0, 10)}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.schoolItem, { backgroundColor: colors.surface , borderColor: colors.outline}]}
                    onPress={() => handleSchoolSelect(item)}
                  >
                    <CustomText fontSize="sm">{item}</CustomText>
                  </TouchableOpacity>
                )}
                style={{ maxHeight: 200 }}
                showsVerticalScrollIndicator={false}
              />
            </View>
          )}
        </View>
        <CustomInput
          label='Graduation Year'
          placeholder='Graduation Year'
          keyboardType='number-pad'
          value={graduationYear}
          onChangeText={setGraduationYear}
          maxLength={4}
        />
      </View>
    </OnboardingPage>
  )
}

export default ProfileSetupOne

const styles = StyleSheet.create({
  schoolList: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    borderWidth: 1,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  schoolItem: {
    padding: 12,
    borderBottomWidth: 1,
  }
})