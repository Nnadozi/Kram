import CustomText from '@/components/CustomText';
import { auth, db } from '@/firebase/firebaseConfig';
import { useUserStore } from '@/stores/userStore';
import { UserProfile } from '@/types/UserProfile';
import { router } from 'expo-router';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function RootIndex() {
  const { setAuthUser, setUserProfile } = useUserStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setAuthUser(user);
        // Fetch user profile from Firestore
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const profileData = userDoc.data();
            setUserProfile(profileData);
            
            if (!profileData?.onboardingComplete) {
              router.replace('/(onboarding)/ProfileSetupOne');
            } else {
              router.replace('/(main)/Groups');
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
        // User is signed out - go to onboarding welcome page
        setAuthUser(null as unknown as User);
        setUserProfile(null as unknown as Partial<UserProfile>);
        router.replace('/(onboarding)');
      }
    });

    return unsubscribe;
  }, [setAuthUser, setUserProfile]);

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
