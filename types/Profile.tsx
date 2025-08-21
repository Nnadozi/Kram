import { Timestamp } from "firebase/firestore";

export interface Profile {
    uid: string;
    email: string;
    school: string;
    state: string;
    firstName: string;
    lastName: string;
    profilePicture: string;
    bio: string;
    year: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
  }

  /* FIREBASE USER INTERFACE
interface User {
  uid: string;                    // Unique user ID
  email: string | null;           // User's email address
  emailVerified: boolean;         // Whether email is verified
  displayName: string | null;     // User's display name
  photoURL: string | null;        // User's profile photo URL
  phoneNumber: string | null;     // User's phone number
  isAnonymous: boolean;           // Whether user is anonymous
  providerData: UserInfo[];       // Array of linked auth providers
  metadata: UserMetadata;         // User creation/update timestamps
  
  // Methods
  delete(): Promise<void>;        // Delete the user account
  getIdToken(forceRefresh?: boolean): Promise<string>;  // Get JWT token
  getIdTokenResult(forceRefresh?: boolean): Promise<IdTokenResult>;  // Get token with claims
  reload(): Promise<void>;        // Refresh user data from server
  toJSON(): object;               // Convert user to JSON
  
  // Provider-specific data
  providerId: string;             // Auth provider ID (e.g., "password", "google.com")
  tenantId: string | null;        // Tenant ID for multi-tenancy
}
 */