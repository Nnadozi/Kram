// Firebase auth error handling utility

export const getFirebaseErrorMessage = (error: any): string => {
  const errorCode = error?.code || error?.message || '';
  
  switch (errorCode) {
    // Email errors
    case 'auth/invalid-email':
      return 'Please enter a valid email address';
    
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please sign in instead';
    
    case 'auth/user-not-found':
      return 'No account found with this email address';
    
    // Password errors
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long';
    
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again';
    
    // Network errors
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection';
    
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later';
    
    // General errors
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled';
    
    case 'auth/requires-recent-login':
      return 'Please sign in again to complete this action';
    
    case 'auth/user-disabled':
      return 'This account has been disabled';
    
    case 'auth/invalid-credential':
      return 'Invalid email or password';
    
    // Default fallback
    default:
      return error?.message || 'An unexpected error occurred. Please try again';
  }
};

export const isFirebaseError = (error: any): boolean => {
  return error?.code?.startsWith('auth/') || false;
};
