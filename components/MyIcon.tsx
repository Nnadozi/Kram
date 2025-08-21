import { Icon } from '@rneui/base';
import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';

interface MyIconProps {
  name: string;
  type?: 'antdesign' | 'entypo' | 'evilicon' | 'feather' | 'font-awesome' | 'font-awesome-5' | 'fontisto' | 'foundation' | 'ionicon' | 'material' | 'material-community' | 'octicon' | 'simple-line-icon' | 'zocial';
  size?: number;
  color?: string;
  style?: ViewStyle;
  onPress?: () => void;
  primary?: boolean;
  opposite?: boolean;
}

const MyIcon = ({ color, size = 30, name, type, onPress, style, primary, opposite }: MyIconProps) => {
  const theme = useTheme();
  return (
    <Icon
      color={color ? color : primary ? theme.colors.primary : opposite ? theme.colors.background : theme.dark ? "white" : "black"}
      name={name}
      type={type}
      size={size} 
      onPress={onPress}
      containerStyle={style}
    />
  );
};

export default MyIcon;
const styles = StyleSheet.create({});