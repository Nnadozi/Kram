import CustomText from '@/components/CustomText'
import { AppearanceMode, useThemeStore } from '@/stores/themeStore'
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native'
import { IconButton, RadioButton, useTheme } from 'react-native-paper'

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
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.surface}]}>
          <View style={styles.content}>
            <View style={[styles.header, {borderBottomColor: colors.outlineVariant}]}>
              <CustomText bold fontSize='lg' >Choose Theme</CustomText>
              <IconButton icon='close' size={20} onPress={onClose} />
            </View>
            
            <RadioButton.Group 
              onValueChange={(value) => handleThemeSelect(value as AppearanceMode)}
              value={appearanceMode}
            >
              <TouchableOpacity 
                style={styles.option}
                onPress={() => handleThemeSelect('light')}
              >
                <View style={styles.optionContent}>
                  <CustomText>Light</CustomText>
                  <CustomText fontSize='sm' gray>Always use light theme</CustomText>
                </View>
                <RadioButton value="light" />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.option}
                onPress={() => handleThemeSelect('dark')}
              >
                <View style={styles.optionContent}>
                  <CustomText>Dark</CustomText>
                  <CustomText fontSize='sm' gray>Always use dark theme</CustomText>
                </View>
                <RadioButton value="dark" />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.option}
                onPress={() => handleThemeSelect('system')}
              >
                <View style={styles.optionContent}>
                  <CustomText>System</CustomText>
                  <CustomText fontSize='sm' gray>Follow system setting</CustomText>
                </View>
                <RadioButton value="system" />
              </TouchableOpacity>
            </RadioButton.Group>
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
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  content: {
    padding:20,
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
