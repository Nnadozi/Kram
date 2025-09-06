import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { router } from 'expo-router';
import * as React from 'react';
import { View } from 'react-native';


export default function WelcomeScreen() {
  return (
    <>
      <View className="flex-1 items-center justify-center gap-8 p-4">
        <Text>Welcome to Kram</Text>
        <Text>A platform for students to connect with each other and share their knowledge</Text>
        <Button onPress={() => router.push('/(auth)/signin')}>
          <Text>Sign in</Text>
        </Button>
        <Button onPress={() => router.push('/(auth)/signup')}>
          <Text>Sign up</Text>
        </Button>
        <Button onPress={() => router.push('/(main)/groups')}>
          <Text>Skio onboarding</Text>
        </Button>
      </View>
    </>
  );
}

