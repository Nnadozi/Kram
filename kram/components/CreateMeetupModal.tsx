import React from 'react'
import { View, Modal } from 'react-native'
import { Text } from '@/components/ui/text'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface CreateMeetupModalProps {
  visible: boolean
  onClose: () => void
  onCreate: (name: string, description: string) => void
  isLoading: boolean
}

export default function CreateMeetupModal({ 
  visible, 
  onClose, 
  onCreate, 
  isLoading 
}: CreateMeetupModalProps) {
  const [meetupName, setMeetupName] = React.useState('')
  const [meetupDescription, setMeetupDescription] = React.useState('')

  const handleCreate = () => {
    onCreate(meetupName, meetupDescription)
    setMeetupName('')
    setMeetupDescription('')
  }

  const handleClose = () => {
    setMeetupName('')
    setMeetupDescription('')
    onClose()
  }

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View className='flex-1 justify-center items-center' style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <View className='bg-white p-6 rounded-lg w-4/5 max-w-md'>
          <Text className='text-xl font-bold mb-4'>Schedule Meetup</Text>
          
          <Input
            placeholder='Meetup name'
            value={meetupName}
            onChangeText={setMeetupName}
            className='mb-4'
          />
          
          <Input
            placeholder='Description (optional)'
            value={meetupDescription}
            onChangeText={setMeetupDescription}
            className='mb-4'
          />
          
          <View className='flex-row space-x-2'>
            <Button 
              onPress={handleClose}
              className='flex-1'
            >
              <Text>Cancel</Text>
            </Button>
            <Button 
              onPress={handleCreate}
              disabled={isLoading}
              className='flex-1'
            >
              <Text>{isLoading ? 'Creating...' : 'Create'}</Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  )
}
