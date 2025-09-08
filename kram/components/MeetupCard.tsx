import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Text } from '@/components/ui/text'
import { Button } from '@/components/ui/button'
import { Meetup } from '@/types/Meetup'
import { Timestamp } from 'firebase/firestore'

interface MeetupCardProps {
  meetup: Meetup
  onPress?: (meetup: Meetup) => void
  onJoin?: (meetup: Meetup) => void
  isJoined?: boolean
  isJoining?: boolean
  currentUserId?: string
}

export default function MeetupCard({ 
  meetup, 
  onPress, 
  onJoin, 
  isJoined = false, 
  isJoining = false, 
  currentUserId 
}: MeetupCardProps) {
  // Helper function to format date and time
  const formatDateTime = (timestamp: Timestamp | Date) => {
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : timestamp
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    }
  }

  // Helper function to format duration
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }

  const dateTime = formatDateTime(meetup.time)
  const duration = formatDuration(meetup.length)

  // Check if current user is already joined
  const userIsJoined = isJoined || (currentUserId && meetup.attendees?.some(attendee => attendee.id === currentUserId))
  const canJoin = !meetup.cancelled && !userIsJoined && onJoin

  return (
    <TouchableOpacity 
      onPress={() => onPress?.(meetup)}
      className={`p-4 rounded-lg mb-3 border ${
        meetup.cancelled 
          ? 'bg-red-50 border-red-200' 
          : 'bg-card border-border'
      }`}
    >
      {/* Header with name and type */}
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-1">
          <Text className={`font-bold text-lg ${
            meetup.cancelled ? 'text-red-600' : 'text-foreground'
          }`}>
            {meetup.name}
          </Text>
          <View className="flex-row items-center mt-1">
            <View className={`px-2 py-1 rounded-full ${
              meetup.type === 'virtual' 
                ? 'bg-blue-100' 
                : 'bg-green-100'
            }`}>
              <Text className={`text-xs font-medium ${
                meetup.type === 'virtual' 
                  ? 'text-blue-700' 
                  : 'text-green-700'
              }`}>
                {meetup.type === 'virtual' ? '🌐 Virtual' : '📍 In Person'}
              </Text>
            </View>
          </View>
        </View>
        {meetup.cancelled && (
          <View className="bg-red-500 px-2 py-1 rounded-full">
            <Text className="text-white text-xs font-bold">CANCELLED</Text>
          </View>
        )}
      </View>

      {/* Description */}
      {meetup.description && (
        <Text className={`text-sm mb-3 ${
          meetup.cancelled ? 'text-red-500' : 'text-muted-foreground'
        }`}>
          {meetup.description}
        </Text>
      )}

      {/* Date and Time */}
      <View className="flex-row items-center mb-2">
        <Text className="text-muted-foreground mr-2">📅</Text>
        <Text className={`text-sm font-medium ${
          meetup.cancelled ? 'text-red-600' : 'text-foreground'
        }`}>
          {dateTime.date} at {dateTime.time}
        </Text>
      </View>

      {/* Location (for in-person meetups) */}
      {meetup.type === 'in-person' && meetup.location && (
        <View className="flex-row items-center mb-2">
          <Text className="text-muted-foreground mr-2">📍</Text>
          <Text className={`text-sm ${
            meetup.cancelled ? 'text-red-500' : 'text-foreground'
          }`}>
            {meetup.location}
          </Text>
        </View>
      )}

      {/* Duration and Attendees */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <Text className="text-muted-foreground mr-2">⏱️</Text>
          <Text className={`text-sm ${
            meetup.cancelled ? 'text-red-500' : 'text-foreground'
          }`}>
            {duration}
          </Text>
        </View>
        
        <View className="flex-row items-center">
          <Text className="text-muted-foreground mr-1">👥</Text>
          <Text className={`text-sm font-medium ${
            meetup.cancelled ? 'text-red-500' : 'text-foreground'
          }`}>
            {meetup.attendees?.length || 0} attending
          </Text>
        </View>
      </View>

      {/* Join Button */}
      {canJoin && (
        <Button
          onPress={() => onJoin?.(meetup)}
          disabled={isJoining}
          className="w-full"
        >
          <Text className="text-primary-foreground font-medium">
            {isJoining ? 'Joining...' : 'Join Meetup'}
          </Text>
        </Button>
      )}

      {/* Joined Status */}
      {userIsJoined && !meetup.cancelled && (
        <View className="bg-green-100 border border-green-200 rounded-lg p-2">
          <Text className="text-green-700 text-sm font-medium text-center">
            ✅ You're attending this meetup
          </Text>
        </View>
      )}
    </TouchableOpacity>
  )
}
