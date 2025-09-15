import CustomText from '@/components/CustomText'
import Page from '@/components/Page'
import { StyleSheet } from 'react-native'


const Profile = () => {
  return (
    <Page style = {{justifyContent: 'flex-start', alignItems: 'center'}}>
      <CustomText textAlign='center' bold fontSize='xl'>Profile</CustomText>
    </Page>
  )
}

export default Profile

const styles = StyleSheet.create({})