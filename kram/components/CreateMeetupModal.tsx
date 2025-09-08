import React, { useState } from 'react'
import { View, Modal, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native'
import { Text } from '@/components/ui/text'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Meetup } from '@/types/Meetup'
import { Timestamp } from 'firebase/firestore'
import DateTimePicker from '@react-native-community/datetimepicker'

interface CreateMeetupModalProps {
  visible: boolean
  onClose: () => void
  onCreate: (meetupData: Partial<Meetup>) => void
  isLoading: boolean
}

export default function CreateMeetupModal({ 
  visible, 
  onClose, 
  onCreate, 
  isLoading 
}: CreateMeetupModalProps) {
  const [meetupName, setMeetupName] = useState('')
  const [meetupDescription, setMeetupDescription] = useState('')
  const [meetupType, setMeetupType] = useState<'virtual' | 'in-person'>('in-person')
  const [location, setLocation] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedTime, setSelectedTime] = useState(new Date())
  const [length, setLength] = useState('')
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)

  const handleCreate = () => {
    // Validation
    if (!meetupName.trim()) {
      Alert.alert('Error', 'Please enter a meetup name')
      return
    }
    if (!length.trim()) {
      Alert.alert('Error', 'Please enter meeting length')
      return
    }
    if (isNaN(Number(length)) || Number(length) <= 0) {
      Alert.alert('Error', 'Please enter a valid meeting length (numbers only)')
      return
    }
    if (meetupType === 'in-person' && !location.trim()) {
      Alert.alert('Error', 'Please enter a location for in-person meetups')
      return
    }

    // Create meetup date and time
    const meetupDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())
    const meetupDateTime = new Date(
      selectedDate.getFullYear(), 
      selectedDate.getMonth(), 
      selectedDate.getDate(),
      selectedTime.getHours(),
      selectedTime.getMinutes()
    )
    
    const meetupData: Partial<Meetup> = {
      name: meetupName.trim(),
      description: meetupDescription.trim(),
      type: meetupType,
      location: meetupType === 'in-person' ? location.trim() : '',
      date: Timestamp.fromDate(meetupDate),
      time: Timestamp.fromDate(meetupDateTime),
      length: parseInt(length),
      attendees: [],
      cancelled: false,
    }

    onCreate(meetupData)
    resetForm()
  }

  const resetForm = () => {
    setMeetupName('')
    setMeetupDescription('')
    setMeetupType('in-person')
    setLocation('')
    setSelectedDate(new Date())
    setSelectedTime(new Date())
    setLength('')
    setShowDatePicker(false)
    setShowTimePicker(false)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const handleLengthChange = (text: string) => {
    // Only allow numbers
    const numericValue = text.replace(/[^0-9]/g, '')
    setLength(numericValue)
  }

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false)
    }
    if (selectedDate) {
      setSelectedDate(selectedDate)
    }
  }

  const onTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false)
    }
    if (selectedTime) {
      setSelectedTime(selectedTime)
    }
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View className='flex-1 justify-end' style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <View className='bg-white rounded-t-3xl max-h-[90%]'>
          <ScrollView showsVerticalScrollIndicator={false} className="p-6">
            <View className="flex-row items-center justify-between mb-6">
              <Text className='text-2xl font-bold'>Schedule Meetup</Text>
              <TouchableOpacity onPress={handleClose}>
                <Text className="text-2xl text-muted-foreground">×</Text>
              </TouchableOpacity>
            </View>
            
            {/* Meetup Name */}
            <View className="mb-4">
              <Text className="text-sm font-medium mb-2">Meetup Name *</Text>
              <Input
                placeholder='Enter meetup name'
                value={meetupName}
                onChangeText={setMeetupName}
                maxLength={75}
              />
            </View>
            
            {/* Description */}
            <View className="mb-4">
              <Text className="text-sm font-medium mb-2">Description</Text>
              <Input
                placeholder='Describe what this meetup is about'
                value={meetupDescription}
                onChangeText={setMeetupDescription}
                maxLength={200}
                multiline={true}
                inputHeight={80}
              />
            </View>

            {/* Meetup Type */}
            <View className="mb-4">
              <Text className="text-sm font-medium mb-2">Type *</Text>
              <View className="flex-row space-x-2">
                <TouchableOpacity
                  onPress={() => setMeetupType('in-person')}
                  className={`flex-1 py-3 px-4 rounded-lg border ${
                    meetupType === 'in-person'
                      ? 'bg-primary border-primary'
                      : 'bg-background border-border'
                  }`}
                >
                  <Text className={`text-center font-medium ${
                    meetupType === 'in-person'
                      ? 'text-primary-foreground'
                      : 'text-foreground'
                  }`}>
                    In Person
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setMeetupType('virtual')}
                  className={`flex-1 py-3 px-4 rounded-lg border ${
                    meetupType === 'virtual'
                      ? 'bg-primary border-primary'
                      : 'bg-background border-border'
                  }`}
                >
                  <Text className={`text-center font-medium ${
                    meetupType === 'virtual'
                      ? 'text-primary-foreground'
                      : 'text-foreground'
                  }`}>
                    Virtual
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Location (only for in-person) */}
            {meetupType === 'in-person' && (
              <View className="mb-4">
                <Text className="text-sm font-medium mb-2">Location *</Text>
                <Input
                  placeholder='Enter meeting location'
                  value={location}
                  onChangeText={setLocation}
                  maxLength={100}
                />
              </View>
            )}

            {/* Date and Time */}
            <View className="mb-4">
              <Text className="text-sm font-medium mb-2">Date & Time *</Text>
              <View className="flex-row space-x-2">
                <View className="flex-1">
                  <Text className="text-xs text-muted-foreground mb-1">Date</Text>
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    className="border border-border rounded-md px-3 py-3 bg-background flex-row items-center justify-between"
                  >
                    <Text className="text-foreground">{formatDate(selectedDate)}</Text>
                    <Text className="text-muted-foreground">📅</Text>
                  </TouchableOpacity>
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-muted-foreground mb-1">Time</Text>
                  <TouchableOpacity
                    onPress={() => setShowTimePicker(true)}
                    className="border border-border rounded-md px-3 py-3 bg-background flex-row items-center justify-between"
                  >
                    <Text className="text-foreground">{formatTime(selectedTime)}</Text>
                    <Text className="text-muted-foreground">🕐</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Meeting Length */}
            <View className="mb-6">
              <Text className="text-sm font-medium mb-2">Meeting Length (minutes) *</Text>
              <Input
                placeholder='e.g., 60'
                value={length}
                onChangeText={handleLengthChange}
                keyboardType="numeric"
                maxLength={3}
              />
            </View>
            
            {/* Action Buttons */}
            <View className='flex-row space-x-2 mb-4'>
              <Button 
                onPress={handleClose}
                className='flex-1'
                variant="outline"
              >
                <Text>Cancel</Text>
              </Button>
              <Button 
                onPress={handleCreate}
                disabled={isLoading}
                className='flex-1'
              >
                <Text>{isLoading ? 'Creating...' : 'Create Meetup'}</Text>
              </Button>
            </View>
          </ScrollView>
        </View>
      </View>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <Modal
          visible={showDatePicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowDatePicker(false)}
        >
          <View className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <View className="bg-white rounded-lg p-4 mx-4 w-80">
              <Text className="text-lg font-semibold mb-4 text-center">Select Date</Text>
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                onChange={onDateChange}
                minimumDate={new Date()}
                style={{ alignSelf: 'center' }}
              />
              <View className="flex-row space-x-2 mt-4">
                <Button
                  onPress={() => setShowDatePicker(false)}
                  className="flex-1"
                  variant="outline"
                >
                  <Text>Cancel</Text>
                </Button>
                <Button
                  onPress={() => setShowDatePicker(false)}
                  className="flex-1"
                >
                  <Text>Done</Text>
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Time Picker Modal */}
      {showTimePicker && (
        <Modal
          visible={showTimePicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowTimePicker(false)}
        >
          <View className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <View className="bg-white rounded-lg p-4 mx-4 w-80">
              <Text className="text-lg font-semibold mb-4 text-center">Select Time</Text>
              <DateTimePicker
                value={selectedTime}
                mode="time"
                display="default"
                onChange={onTimeChange}
                is24Hour={false}
                style={{ alignSelf: 'center' }}
              />
              <View className="flex-row space-x-2 mt-4">
                <Button
                  onPress={() => setShowTimePicker(false)}
                  className="flex-1"
                  variant="outline"
                >
                  <Text>Cancel</Text>
                </Button>
                <Button
                  onPress={() => setShowTimePicker(false)}
                  className="flex-1"
                >
                  <Text>Done</Text>
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </Modal>
  )
}
