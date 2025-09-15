import CustomText from '@/components/CustomText'
import Page from '@/components/Page'
import { StyleSheet } from 'react-native'

const Meetups = () => {
  return (
    <Page style = {{justifyContent: 'flex-start', alignItems: 'flex-start'}}>
      <CustomText bold fontSize='2xl'>Meetups</CustomText>
    </Page> 
  )
}

export default Meetups

const styles = StyleSheet.create({})