import React from 'react'
import { View } from 'react-native'
import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  height?: number
  width?: number | string
}

const Skeleton = React.memo(({ className, height = 20, width = '100%' }: SkeletonProps) => {
  return (
    <View
      className={cn(
        'bg-muted rounded-md animate-pulse',
        className
      )}
      style={{ height, width }}
    />
  )
})

Skeleton.displayName = 'Skeleton'

export { Skeleton }
