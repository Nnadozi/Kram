import React from 'react';
import { Platform, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

interface PageProps { 
  children:React.ReactNode
  style?: ViewStyle,
}

const Page = ({style, children}:PageProps) => {
  const insets = useSafeAreaInsets();
  const theme = useTheme()
  return (
    <SafeAreaView style={[styles.con, style, {
      paddingTop: Platform.OS === 'ios' ? insets.top * 0.25 : insets.top * 0.5,
      paddingBottom: insets.bottom * 0.25,
      paddingLeft: insets.top * 0.5 ,
      paddingRight: insets.top * 0.5,
      backgroundColor: theme.colors.background,
    }]}>
        {children}
    </SafeAreaView>
  )
}

export default Page

const styles = StyleSheet.create({
    con:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
    }
})