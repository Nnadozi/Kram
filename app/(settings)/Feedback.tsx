import CustomButton from '@/components/CustomButton'
import CustomInput from '@/components/CustomInput'
import CustomText from '@/components/CustomText'
import Page from '@/components/Page'
import { auth, functions } from '@/firebaseConfig'
import { useAsyncOperation } from '@/hooks/useAsyncOperation'
import { router } from 'expo-router'
import { httpsCallable } from 'firebase/functions'
import { useState } from 'react'
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { IconButton } from 'react-native-paper'

// Feedback categories with icons and descriptions
const FEEDBACK_CATEGORIES = [
  { id: 'bug', label: 'Bug Report', icon: '🐛', description: 'Report issues or errors' },
  { id: 'feature', label: 'Feature Request', icon: '✨', description: 'Suggest new features' },
  { id: 'ui', label: 'UI/UX Feedback', icon: '🎨', description: 'Design improvements' },
  { id: 'suggestion', label: 'General Suggestion', icon: '💡', description: 'Overall improvements' },
  { id: 'other', label: 'Other', icon: '📋', description: 'Other feedback' },
]

const Feedback = () => {
  const [feedback, setFeedback] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('suggestion') // Default to general suggestion
  
  const { execute: submitFeedback, isLoading } = useAsyncOperation({
    onSuccess: () => {
      Alert.alert(
        'Thank You!',
        'Your feedback has been submitted successfully. We appreciate you taking the time to help us improve.',
        [{ text: 'OK', onPress: () => router.back() }]
      )
      setFeedback('')
      setSelectedCategory('suggestion')
    },
    showErrorAlert: true,
    errorMessage: 'Failed to submit feedback. Please try again.'
  })

  const handleSubmitFeedback = () => {
    if (!feedback.trim()) {
      Alert.alert('Error', 'Please enter your feedback before submitting.')
      return
    }

    if (feedback.length < 50) {
      Alert.alert('Error', 'Please provide more detailed feedback (at least 50 characters).')
      return
    }

    // Submit feedback using Firebase callable function with Resend API
    submitFeedback(async () => {
      const sendFeedback = httpsCallable(functions, 'sendFeedback')
      
      const result = await sendFeedback({
        message: feedback.trim(),
        category: selectedCategory,
        userEmail: auth.currentUser?.email,
        userId: auth.currentUser?.uid
      })
      
      return result.data
    })
  }


  const renderCategoryChip = (category: typeof FEEDBACK_CATEGORIES[0]) => {
    const isSelected = selectedCategory === category.id
    
    return (
      <TouchableOpacity
        key={category.id}
        style={[styles.categoryChip, isSelected && styles.selectedCategoryChip]}
        onPress={() => setSelectedCategory(category.id)}
        activeOpacity={0.7}
      >
        <CustomText style={styles.categoryIcon}>{category.icon}</CustomText>
        <CustomText 
          fontSize='sm' 
          style={isSelected ? styles.selectedCategoryLabel : styles.categoryLabel}
        >
          {category.label}
        </CustomText>
      </TouchableOpacity>
    )
  }

  const selectedCategoryData = FEEDBACK_CATEGORIES.find(cat => cat.id === selectedCategory)

  return (
    <Page style={{alignItems: 'flex-start', justifyContent: 'flex-start'}}>
      <View style={styles.topContainer}>
        <IconButton onPress={() => router.back()} icon='chevron-left' size={20} />
        <CustomText bold fontSize='lg'>Feedback</CustomText>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <CustomText fontSize='base' style={styles.description}>
            We value your feedback! Help us improve Kram by sharing your thoughts, suggestions, or reporting any issues you've encountered.
          </CustomText>
          
          {/* Category Selection */}
          <View style={styles.categoryContainer}>
            <CustomText bold fontSize='sm' style={styles.label}>
              Feedback Category
            </CustomText>
            <CustomText fontSize='xs' style={styles.categoryDescription}>
              {selectedCategoryData?.description || 'Select a category for your feedback'}
            </CustomText>
            
            <View style={styles.categoriesGrid}>
              {FEEDBACK_CATEGORIES.map(renderCategoryChip)}
            </View>
          </View>
          
          {/* Feedback Input */}
          <View style={styles.inputContainer}>
            <CustomText bold fontSize='sm' style={styles.label}>
              Your Feedback
            </CustomText>
            <CustomInput
              value={feedback}
              onChangeText={setFeedback}
              placeholder="Share your thoughts, suggestions, or report issues..."
              multiline
              numberOfLines={8}
              maxLength={2000}
              showCharCounter
              style={styles.textInput}
            />
          </View>
          
          <View style={styles.buttonContainer}>
            <CustomButton
              onPress={handleSubmitFeedback}
              loading={isLoading}
              loadingText="Submitting..."
              disabled={!feedback.trim() || feedback.length < 10}
            >
              Submit Feedback
            </CustomButton>
          </View>
        </View>
      </ScrollView>
    </Page>
  )
}

export default Feedback

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
  contentContainer: {
    width: '100%',
    paddingBottom: 20,
  },
  description: {
    marginBottom: 24,
    lineHeight: 22,
    color: '#666',
  },
  categoryContainer: {
    marginBottom: 24,
  },
  label: {
    marginBottom: 8,
    color: '#333',
  },
  categoryDescription: {
    color: '#666',
    marginBottom: 12,
    lineHeight: 18,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f9f9f9',
    marginBottom: 8,
  },
  selectedCategoryChip: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryIcon: {
    marginRight: 6,
    fontSize: 16,
  },
  categoryLabel: {
    color: '#666',
    fontWeight: '500',
  },
  selectedCategoryLabel: {
    color: 'white',
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 24,
  },
  textInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    padding: 20,
    gap: 12,
  },
})