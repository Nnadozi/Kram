// Simple input validation functions

// Basic validation functions
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2 && name.trim().length <= 50;
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

export const validateRequired = (value: any): boolean => {
  return value !== undefined && value !== null && value !== '';
};

export const validateMinLength = (value: string, min: number): boolean => {
  return value.trim().length >= min;
};

export const validateMaxLength = (value: string, max: number): boolean => {
  return value.trim().length <= max;
};

// Simple form validation
export const validateForm = (data: Record<string, any>, rules: Record<string, (value: any) => boolean>): Record<string, string> => {
  const errors: Record<string, string> = {};

  for (const [field, value] of Object.entries(data)) {
    const validator = rules[field];
    if (validator && !validator(value)) {
      errors[field] = getErrorMessage(field);
    }
  }

  return errors;
};

// Error messages
const getErrorMessage = (field: string): string => {
  const messages: Record<string, string> = {
    email: 'Please enter a valid email address',
    password: 'Password must be at least 8 characters',
    firstName: 'First name must be 2-50 characters',
    lastName: 'Last name must be 2-50 characters',
    phone: 'Please enter a valid phone number',
    school: 'Please enter a school name',
    graduationYear: 'Please enter a valid graduation year',
    bio: 'Bio must be less than 500 characters',
    groupName: 'Group name must be 3-50 characters',
    groupDescription: 'Description must be 10-500 characters',
    meetupName: 'Meetup name must be 3-100 characters',
    meetupDescription: 'Description must be 10-1000 characters',
    messageText: 'Message must be 1-1000 characters',
  };
  
  return messages[field] || 'Invalid input';
};

// Common validation rules
export const validationRules = {
  email: (value: string) => validateRequired(value) && validateEmail(value),
  password: (value: string) => validateRequired(value) && validatePassword(value),
  firstName: (value: string) => validateRequired(value) && validateName(value),
  lastName: (value: string) => validateRequired(value) && validateName(value),
  phone: (value: string) => !value || validatePhone(value),
  school: (value: string) => validateRequired(value) && validateMinLength(value, 2),
  graduationYear: (value: number) => {
    if (!validateRequired(value)) return false;
    const currentYear = new Date().getFullYear();
    return value >= currentYear - 10 && value <= currentYear + 10;
  },
  bio: (value: string) => !value || validateMaxLength(value, 500),
  groupName: (value: string) => validateRequired(value) && validateMinLength(value, 3) && validateMaxLength(value, 50),
  groupDescription: (value: string) => validateRequired(value) && validateMinLength(value, 10) && validateMaxLength(value, 500),
  meetupName: (value: string) => validateRequired(value) && validateMinLength(value, 3) && validateMaxLength(value, 100),
  meetupDescription: (value: string) => validateRequired(value) && validateMinLength(value, 10) && validateMaxLength(value, 1000),
  messageText: (value: string) => validateRequired(value) && validateMinLength(value, 1) && validateMaxLength(value, 1000),
};

export default {
  validateEmail,
  validatePassword,
  validateName,
  validatePhone,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateForm,
  validationRules,
};

