import CustomText from '@/components/CustomText';
import { auth } from '@/firebase/firebaseConfig';
import { userService } from '@/services/userService';
import { useUserStore } from '@/stores/userStore';
import { router } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function RootIndex() {
  const { setAuthUser, setUserProfile } = useUserStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setAuthUser(user);
        // Use userService to fetch profile data
        try {
          const userProfile = await userService.getUserProfile(user.uid);

          if (userProfile) {
            setUserProfile(userProfile);

            if (!userProfile.onboardingComplete) {
              router.replace('/(onboarding)/ProfileSetupOne');
            } else {
              router.replace('/(main)/(tabs)/Groups');
            }
          } else {
            // No profile exists, start onboarding
            router.replace('/(onboarding)/ProfileSetupOne');
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          router.replace('/(onboarding)/ProfileSetupOne');
        }
      } else {
        // User is signed out - clear state and go to onboarding welcome page
        setAuthUser(null);
        setUserProfile(null);
        router.replace('/(onboarding)');
      }
    });

    return unsubscribe;
  }, []);

  // Show loading screen while checking auth state
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <ActivityIndicator size="large" color="#007AFF" />
      <CustomText style={{ marginTop: 16 }} fontSize="sm" gray>
        Loading...
      </CustomText>
    </View>
  );
}
