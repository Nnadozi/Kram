import { FieldValue } from "firebase/firestore";

export type UserProfile = {
  uid: string;
  authType: string;
  firstName: string;
  lastName: string;
  email: string;
  school: string;
  graduationYear: number;
  majors: string[];
  minors: string[];
  onboardingComplete: boolean;
  bio: string;
  groups: string[]; 
  avatar: string; 
  createdAt: FieldValue | Date;
  updatedAt: FieldValue | Date;
}

/*
interface User {
  // Basic info
  uid: string                    // Unique user ID
  email: string | null          // User's email address
  displayName: string | null    // User's display name
  photoURL: string | null       // User's profile photo URL
  
  // Verification status
  emailVerified: boolean        // Whether email is verified
  phoneNumber: string | null    // User's phone number
  
  // Account status
  isAnonymous: boolean          // Whether user is anonymous
  disabled: boolean             // Whether account is disabled
  
  // Metadata
  metadata: UserMetadata        // Creation and last sign-in times
  providerData: UserInfo[]      // Provider-specific user info
  
  // Tokens
  refreshToken: string          // Refresh token for API calls
  accessToken?: string          // Access token (if available)
  
  // Multi-factor
  multiFactor: MultiFactorUser  // Multi-factor authentication info
}
*/