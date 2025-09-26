import ActivityIndicator from '@/components/ActivityIndicator';
import { auth } from '@/firebaseConfig';
import { useEmailVerificationDeadline } from '@/hooks/useEmailVerificationDeadline';
import { userService } from '@/services/userService';
import { useUserStore } from '@/stores/userStore';
import { router } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { View } from 'react-native';

export default function RootIndex() {
  const { setAuthUser, setUserProfile, isEmailVerified, clearEmailVerificationDeadline } = useUserStore();
  const { shouldShowEmailVerification } = useEmailVerificationDeadline();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setAuthUser(user);
        
        // Check email verification first
        if (!user.emailVerified && shouldShowEmailVerification) {
          setTimeout(() => {
            router.replace('/(auth)/EmailVerification');
          }, 100);
          return;
        }
        
        // If email is verified, clear any existing deadline
        if (user.emailVerified) {
          clearEmailVerificationDeadline();
        }
        
        // Use userService to fetch profile data
        try {
          const userProfile = await userService.getUserProfile(user.uid);

          if (userProfile) {
            setUserProfile(userProfile);

            if (!userProfile.onboardingComplete) {
              setTimeout(() => {
                router.replace('/(onboarding)/ProfileSetupOne');
              }, 100);
            } else {
              setTimeout(() => {
                router.replace('/(main)/(tabs)/Groups');
              }, 100);
            }
          } else {
            // No profile exists, start onboarding
            setTimeout(() => {
              router.replace('/(onboarding)/ProfileSetupOne');
            }, 100);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setTimeout(() => {
            router.replace('/(onboarding)/ProfileSetupOne');
          }, 100);
        }
      } else {
        // User is signed out - clear state and go to onboarding welcome page
        setAuthUser(null);
        setUserProfile(null);
        setTimeout(() => {
          router.replace('/(onboarding)');
        }, 100);
      }
    });

    return unsubscribe;
  }, [shouldShowEmailVerification]);

  // Show loading screen while checking auth state
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <ActivityIndicator 
        size="large" 
        message="Loading..." 
      />
    </View>
  );
}
