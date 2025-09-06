import '@/global.css';
import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/firebase/firebaseConfig';
import { useUserStore } from '@/stores/userStore';
import { doc, getDoc } from 'firebase/firestore';
import { router } from 'expo-router';
export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const { setAuthUser, setUserProfile, initializeAuth } = useUserStore();

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
              router.replace('/(onboarding)/profileSetupOne');
            } else {
              router.replace('/(main)/groups');
            }
          } else {
            // No profile exists, start onboarding
            router.replace('/(onboarding)/profileSetupOne');
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          router.replace('/(onboarding)/profileSetupOne');
        }
      } else {
        // User is signed out
        initializeAuth();
        router.replace('/(auth)/signin');
      }
    });

    return unsubscribe;
  }, []);

  return (
    <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(main)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(groups)" />
      </Stack>
      <PortalHost />
    </ThemeProvider>
  );
}
