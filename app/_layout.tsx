import { CustomLightTheme } from "@/constants/Colors";
import { auth, db } from '@/firebase/firebaseConfig';
import { useUserStore } from '@/stores/userStore';
import { UserProfile } from '@/types/UserProfile';
import { router, Stack } from 'expo-router';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect } from 'react';
import { PaperProvider } from 'react-native-paper';

export default function RootLayout() {
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
              router.replace('/(main)/MyGroups');
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
  }, []);

  return (
    <PaperProvider theme={CustomLightTheme}>
      <Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(main)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="GroupDetail" />
      </Stack>
    </PaperProvider>
  );
}
