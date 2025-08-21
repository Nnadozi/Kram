import MyButton from '@/components/MyButton'
import MyInput from '@/components/MyInput'
import Page from '@/components/Page'
import React, { useState } from 'react'
import { StyleSheet } from 'react-native'

const signin = () => {
  const [email, setEmail] = useState('')
  return (
    <Page>
      <MyInput
        placeholder='Enter Email'
        value={email}
        onChangeText={setEmail}
      />
      <MyButton
        title='Send One-Time Code'
        style = {{marginTop: 20}}
        onPress={() => {}}
      />
    </Page>
  )
}

export default signin

const styles = StyleSheet.create({})