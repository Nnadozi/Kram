import MyInput from '@/components/MyInput'
import MyText from '@/components/MyText'
import OnboardScreen from '@/components/OnboardScreen'
import { usStates } from '@/constants/usStates'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Alert, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import { useTheme } from 'react-native-paper'

const findSchool = () => {
  const [schools, setSchools] = useState<any[]>([])
  const [selectedState, setSelectedState] = useState('')
  const [selectedSchool, setSelectedSchool] = useState('')
  const [stateSearchText, setStateSearchText] = useState('')
  const [schoolSearchText, setSchoolSearchText] = useState('')
  const [filteredStates, setFilteredStates] = useState<any[]>(usStates)
  const [filteredSchools, setFilteredSchools] = useState<any[]>([])
  const [showStateDropdown, setShowStateDropdown] = useState(false)
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false)
  const [email, setEmail] = useState('')
  const theme = useTheme()

  let apiKey = process.env.EXPO_PUBLIC_COLLEGE_SCORECARD_API_KEY 

  // Fetch schools when state is selected
  useEffect(() => {
    if (selectedState) {
      const fetchSchoolsByState = async () => {
        try {
          console.log('Using API key:', apiKey)
          const url = `https://api.data.gov/ed/collegescorecard/v1/schools.json?api_key=${apiKey}&fields=school.name&school.state=${selectedState}&per_page=100&sort=school.name`
          console.log('Fetching URL:', url)
          
          const response = await fetch(url)
          console.log('Response status:', response.status)
          console.log('Response headers:', response.headers)
          
          const responseText = await response.text()
          console.log('Raw response:', responseText.substring(0, 200)) // First 200 chars
          
          const data = JSON.parse(responseText)
          console.log(`Schools in ${selectedState}:`, data.results)
          
          if (data.results && Array.isArray(data.results)) {
            setSchools(data.results)
            setFilteredSchools(data.results)
            console.log(`Found ${data.results.length} schools in ${selectedState}`)
          }
        } catch (error) {
          console.error('Error fetching schools by state:', error)
        }
      }
      
      fetchSchoolsByState()
    } else {
      setSchools([])
      setFilteredSchools([])
    }
  }, [selectedState])

  // Filter states based on search text
  useEffect(() => {
    if (stateSearchText.trim() === '') {
      setFilteredStates(usStates)
    } else {
      const filtered = usStates.filter(state => 
        state.name.toLowerCase().includes(stateSearchText.toLowerCase()) ||
        state.abbreviation.toLowerCase().includes(stateSearchText.toLowerCase())
      )
      setFilteredStates(filtered)
    }
  }, [stateSearchText])

  // Filter schools based on search text
  useEffect(() => {
    if (schoolSearchText.trim() === '') {
      setFilteredSchools(schools)
    } else {
      const filtered = schools.filter(school => 
        school["school.name"]?.toLowerCase().includes(schoolSearchText.toLowerCase())
      )
      setFilteredSchools(filtered)
    }
  }, [schoolSearchText, schools])

  const handleStateSelect = (state: any) => {
    setSelectedState(state.abbreviation)
    setStateSearchText(state.name)
    setShowStateDropdown(false)
    setSelectedSchool('') // Reset school selection when state changes
    setSchoolSearchText('') // Reset school search
    console.log('Selected state:', state.name, '(', state.abbreviation, ')')
  }

  const handleSchoolSelect = (school: any) => {
    setSelectedSchool(school["school.name"])
    setSchoolSearchText(school["school.name"])
    setShowSchoolDropdown(false)
    console.log('Selected school:', school["school.name"])
  }

  const handleNext = () => {
    //make sure the email is valid
    if (!email.includes('@') || !email.includes('.edu')) {
      Alert.alert('Invalid Email', 'Please enter a valid edu email address')
      return
    }
    router.navigate({pathname: '/(onboarding)/verifySchool', params: {
      school: selectedSchool,
      state: selectedState,
      email: email.trim()
    }})
  }

  return (
    <OnboardScreen
      title="Find Your School"
      description="Let's find your school"
      onButtonPress={handleNext}
      progress={0.3}
      buttonEnabled={!!(selectedSchool && selectedState && email.length > 0)}
    >
      {/* State Selection */}
      <View style={{width: '100%', marginTop: 10, position: 'relative'}}>
        <MyInput
          placeholder="Search for your state..."
          label="Select State"
          value={stateSearchText}
          onChangeText={(text) => {
            setStateSearchText(text)
            setShowStateDropdown(true)
          }}
          onFocus={() => setShowStateDropdown(true)}
        />
        
        {showStateDropdown && filteredStates.length > 0 && (
          <View style={styles.dropdownContainer}>
            <FlatList
              data={filteredStates}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.stateItem}
                  onPress={() => handleStateSelect(item)}
                >
                  <MyText>{item.name}</MyText>
                </TouchableOpacity>
              )}
              style={styles.dropdownList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}
      </View>

      {/* School Selection (only show if state is selected) */}
      {selectedState && (
        <View style={{width: '100%', marginTop: 10, position: 'relative'}}>
          <MyInput
            label="Select School"
            placeholder="Search for your school..."
            value={schoolSearchText}
            onChangeText={(text) => {
              setSchoolSearchText(text)
              setShowSchoolDropdown(true)
            }}
            onFocus={() => setShowSchoolDropdown(true)}
          />
          
          {showSchoolDropdown && filteredSchools.length > 0 && (
            <View style={styles.dropdownContainer}>
              <FlatList
                data={filteredSchools.slice(0, 50)}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.schoolItem}
                    onPress={() => handleSchoolSelect(item)}
                  >
                    <MyText>{item["school.name"]}</MyText>
                  </TouchableOpacity>
                )}
                style={styles.dropdownList}
                showsVerticalScrollIndicator={false}
              />
            </View>
          )}
          {
            selectedSchool && selectedState && (
              <MyInput 
                label="Enter School Email"
                placeholder="Enter your school email"
                value={email}
                onChangeText={(text) => setEmail(text)}
                style={{marginTop: 10}}
                keyboardType='email-address'
              />
            )
          }
        </View>
      )}
    </OnboardScreen>
  )
}

export default findSchool

const styles = StyleSheet.create({
  dropdownContainer: {
    position: 'absolute',
    top: 55,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    maxHeight: 300,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownList: {
    flex: 1,
  },
  stateItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  schoolItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
})