import MyInput from '@/components/MyInput'
import Page from '@/components/Page'
import React, { useState } from 'react'
import { StyleSheet } from 'react-native'

const Home = () => {
  const [inputValue, setInputValue] = useState('')

  return (
    <Page>
      <MyInput 
        placeholder='Hi' 
        value={inputValue}
        onChangeText={setInputValue}
        width={"100%"}
        mode='outlined'
      />
    </Page>
  )
}

export default Home

const styles = StyleSheet.create({})