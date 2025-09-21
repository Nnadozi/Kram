import CustomText from '@/components/CustomText'
import { AppearanceMode, useThemeStore } from '@/stores/themeStore'
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native'
import { useTheme } from 'react-native-paper'

interface AppearanceModalProps {
  visible: boolean
  onClose: () => void
}

const AppearanceModal = ({ visible, onClose }: AppearanceModalProps) => {
  const { colors } = useTheme()
  const { appearanceMode, updateAppearanceMode } = useThemeStore()

  const handleThemeSelect = (theme: AppearanceMode) => {
    updateAppearanceMode(theme)
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
            <CustomText bold fontSize='lg'>Appearance</CustomText>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <CustomText bold fontSize='lg'>×</CustomText>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <CustomText fontSize='base' style={styles.sectionTitle}>Theme</CustomText>
            
            <TouchableOpacity 
              style={styles.option}
              onPress={() => handleThemeSelect('light')}
            >
              <View style={styles.optionContent}>
                <CustomText>Light</CustomText>
                <CustomText fontSize='sm' gray>Always use light theme</CustomText>
              </View>
              <View style={[styles.radioButton, { borderColor: appearanceMode === 'light' ? colors.primary : colors.outline }]}>
                <View style={[styles.radioInner, { backgroundColor: appearanceMode === 'light' ? colors.primary : 'transparent' }]} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.option}
              onPress={() => handleThemeSelect('dark')}
            >
              <View style={styles.optionContent}>
                <CustomText>Dark</CustomText>
                <CustomText fontSize='sm' gray>Always use dark theme</CustomText>
              </View>
              <View style={[styles.radioButton, { borderColor: appearanceMode === 'dark' ? colors.primary : colors.outline }]}>
                <View style={[styles.radioInner, { backgroundColor: appearanceMode === 'dark' ? colors.primary : 'transparent' }]} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.option}
              onPress={() => handleThemeSelect('system')}
            >
              <View style={styles.optionContent}>
                <CustomText>System</CustomText>
                <CustomText fontSize='sm' gray>Follow system setting</CustomText>
              </View>
              <View style={[styles.radioButton, { borderColor: appearanceMode === 'system' ? colors.primary : colors.outline }]}>
                <View style={[styles.radioInner, { backgroundColor: appearanceMode === 'system' ? colors.primary : 'transparent' }]} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default AppearanceModal

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
  sectionTitle: {
    marginBottom: 16,
    color: '#666',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
