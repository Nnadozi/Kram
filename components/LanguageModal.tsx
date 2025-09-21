import CustomText from '@/components/CustomText'
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native'
import { useTheme } from 'react-native-paper'

interface LanguageModalProps {
  visible: boolean
  onClose: () => void
}

const LanguageModal = ({ visible, onClose }: LanguageModalProps) => {
  const { colors } = useTheme()

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'de', name: 'German', nativeName: 'Deutsch' },
    { code: 'zh', name: 'Chinese', nativeName: '中文' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  ]

  const handleLanguageSelect = (languageCode: string) => {
    // TODO: Implement language switching logic
    console.log('Language selected:', languageCode)
    onClose()
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.surface }]}>
          <View style={styles.header}>
            <CustomText bold fontSize='lg'>Language</CustomText>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <CustomText bold fontSize='lg'>×</CustomText>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {languages.map((language, index) => (
              <TouchableOpacity 
                key={language.code}
                style={[
                  styles.option,
                  index === languages.length - 1 && styles.lastOption
                ]}
                onPress={() => handleLanguageSelect(language.code)}
              >
                <View style={styles.optionContent}>
                  <CustomText>{language.nativeName}</CustomText>
                  <CustomText fontSize='sm' gray>{language.name}</CustomText>
                </View>
                <View style={[
                  styles.radioButton, 
                  { borderColor: language.code === 'en' ? colors.primary : colors.outline }
                ]}>
                  <View style={[
                    styles.radioInner, 
                    { backgroundColor: language.code === 'en' ? colors.primary : 'transparent' }
                  ]} />
                </View>
              </TouchableOpacity>
            ))}
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  closeButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  lastOption: {
    borderBottomWidth: 0,
  },
  optionContent: {
    flex: 1,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
})
