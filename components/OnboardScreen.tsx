import React from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'
import ConfettiCannon from 'react-native-confetti-cannon'
import { ProgressBar, useTheme } from 'react-native-paper'
import MyButton from './MyButton'
import MyText from './MyText'
import Page from './Page'

interface OnboardScreenProps {
  title: string
  description: string
  buttonText?: string
  onButtonPress: () => void
  buttonEnabled?: boolean
  progress: number
  children?: React.ReactNode
  style?: ViewStyle
}

const OnboardScreen = ({title, description, buttonText, onButtonPress, buttonEnabled = true, progress, children, style}: OnboardScreenProps) => {
  const theme = useTheme()
  return (
    <Page style={styles.container}>
        <View style={styles.topSection}>
            <ProgressBar progress={progress} color={theme.colors.primary} style={styles.progressBar} />
            <MyText textAlign='center' bold fontSize='large'>{title}</MyText>
            <MyText textAlign='center'>{description}</MyText>
        </View>
        <View style={[styles.contentContainer, style]}>
            {children}
        </View>
        <MyButton title={buttonText ?? 'Continue'} onPress={onButtonPress} width={300} disabled={!buttonEnabled} />
        {title == "All Done!" && <ConfettiCannon fallSpeed={2500} explosionSpeed={300 } count={200} origin={{x: -10, y: 0}} />}
    </Page>
  )
}

export default OnboardScreen

const styles = StyleSheet.create({
    container:{
        justifyContent:'space-between',
        alignItems:'center',

    },
    topSection:{
        marginBottom: 10,
        width: '100%',
    },
    contentContainer:{
        //borderWidth: 1,
        width: '100%',
        flex:1
    },
    progressBar: {
        borderRadius: 10,
        width: 300,
        height: 7.5,
        marginBottom: 10,
        alignSelf:'center',
    }
})