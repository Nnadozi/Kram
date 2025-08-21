import { StyleSheet, ViewStyle } from 'react-native';
import { Button, useTheme } from 'react-native-paper';

interface MyButtonProps {
    title: string;
    onPress: () => void;
    style?: ViewStyle;
    disabled?: boolean;
    width?:any
    marginVertical?:any
    isLoading?: boolean;
    icon?:string;
    mode?: "text" | "contained" | "outlined" | "elevated" | "contained-tonal"
}

const MyButton = ({title, onPress, style, disabled, width, marginVertical, isLoading, icon, mode}:MyButtonProps) => {
  const theme = useTheme()
  return (
    <Button 
      icon={icon}
      mode={mode || "contained"}
      onPress={onPress}
      style={[style,{marginVertical:marginVertical, width:width}]}
      disabled={disabled}
      loading={isLoading}
    >
     {title}
    </Button>
  )
}

export default MyButton

const styles = StyleSheet.create({})
