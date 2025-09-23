import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import CustomButton from './CustomButton';
import CustomText from './CustomText';
import Page from './Page';

interface OnboardingScreenProps {
  title: string;
  description: string;
  progress: number;
  children?: React.ReactNode;
  buttonTitle?: string;
  buttonDisabled?: boolean;
  onButtonPress?: () => void;
}

const OnboardingScreen = ({ title, description, progress, children, buttonTitle, buttonDisabled, onButtonPress }: OnboardingScreenProps) => {
  const colors = useTheme().colors;
  return (
    <Page style={styles.container}>
        <View style={styles.topRow}>
            <View style={[styles.progressContainer, { backgroundColor: colors.inverseOnSurface }]}>
                <View style={[styles.progressBarFill, { width: `${progress * 100}%`, backgroundColor: colors.primary }]} />
            </View>
            <CustomText textAlign='center' bold fontSize='2xl'>{title}</CustomText>
            <CustomText textAlign='center' style={{lineHeight: 20}} fontSize='sm'>{description}</CustomText>
        </View>
        {children}
        <View style={styles.buttonContainer}>
            <CustomButton width='80%' variant='contained' disabled={buttonDisabled} onPress={onButtonPress || (() => {})}>{buttonTitle || 'Next'}</CustomButton>
        </View>
    </Page>
  )
}

export default OnboardingScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topRow: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginVertical: 5,
  },
  progressContainer: {
    width: "90%",
    height: 10,
    borderRadius:10,
    marginBottom: 12.5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 10,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 15,
  }
})