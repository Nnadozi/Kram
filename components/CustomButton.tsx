import { StyleSheet } from 'react-native';
import { Button, ButtonProps, useTheme } from 'react-native-paper';


interface CustomButtonProps extends ButtonProps {
  variant?: 'contained' | 'outlined' | 'text' | 'elevated' | 'contained-tonal';
  width?: any
}
//make vatiant contained default
const CustomButton = ({variant = "contained", width = "100%", ...props}: CustomButtonProps) => {
  const {colors} = useTheme();
  return (
    <Button
    {...props}
    mode={variant}
    style={{borderColor: variant === "outlined" ? colors.primary : "transparent", width: width || "100%",}}
    labelStyle={{fontWeight: "bold"}}
    />
  )
}

export default CustomButton

const styles = StyleSheet.create({})