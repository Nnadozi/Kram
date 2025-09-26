import CustomText from '@/components/CustomText'
import { useState } from 'react'
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native'
import { IconButton, RadioButton, useTheme } from 'react-native-paper'

interface LanguageModalProps {
  visible: boolean
  onClose: () => void
}

const LanguageModal = ({ visible, onClose }: LanguageModalProps) => {
  const { colors } = useTheme()
  const [selectedLanguage, setSelectedLanguage] = useState('en') // Default to English

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'de', name: 'German', nativeName: 'Deutsch' },
    { code: 'zh', name: 'Chinese', nativeName: '中文' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  ]

  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode)
    // TODO: Implement language switching logic
    console.log('Language selected:', languageCode)
    onClose()
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.surface}]}>
          <View style={styles.content}>
            <View style={[styles.header, {borderBottomColor: colors.outlineVariant}]}>
              <CustomText bold fontSize='lg' >Choose Language</CustomText>
              <IconButton icon='close' size={20} onPress={onClose} />
            </View>
            
            <RadioButton.Group 
              onValueChange={(value) => handleLanguageSelect(value)}
              value={selectedLanguage}
            >
              {languages.map((language) => (
                <TouchableOpacity 
                  key={language.code}
                  style={styles.option}
                  onPress={() => handleLanguageSelect(language.code)}
                >
                  <View style={styles.optionContent}>
                    <CustomText>{language.nativeName}</CustomText>
                    <CustomText fontSize='sm' gray>{language.name}</CustomText>
                  </View>
                  <RadioButton value={language.code} />
                </TouchableOpacity>
              ))}
            </RadioButton.Group>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default LanguageModal

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  content: {
    padding: 20,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12.5,
  },
  optionContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', 
    marginBottom: 10,
    borderBottomWidth: 1,
  },
})