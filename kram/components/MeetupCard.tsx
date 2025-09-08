import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Text } from '@/components/ui/text'
import { Meetup } from '@/types/Meetup'

interface MeetupCardProps {
  meetup: Meetup
  onPress?: (meetup: Meetup) => void
}

export default function MeetupCard({ meetup, onPress }: MeetupCardProps) {
  return (
    <TouchableOpacity 
      onPress={() => onPress?.(meetup)}
      className='p-4 bg-gray-100 rounded-lg mb-2'
    >
      <Text className='font-semibold text-lg'>{meetup.name}</Text>
      {meetup.description && (
        <Text className='text-gray-600 mt-1'>{meetup.description}</Text>
      )}
      <Text className='text-sm text-gray-500 mt-2'>
        {meetup.attendees?.length || 0} attendees
      </Text>
      {meetup.cancelled && (
        <Text className='text-red-500 text-sm mt-1 font-semibold'>
          CANCELLED
        </Text>
      )}
    </TouchableOpacity>
  )
}
