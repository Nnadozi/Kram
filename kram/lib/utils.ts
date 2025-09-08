import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ValidationCriteria {
  minLength?: number;
  maxLength?: number;
  required?: boolean;
  lettersOnly?: boolean;
  numbersOnly?: boolean;
  allowSpecialChars?: boolean;
  pattern?: RegExp;
  customValidator?: (input: string) => boolean;
}

export function validateInput(
  input: string, 
  criteria: ValidationCriteria = {}
): { isValid: boolean; error?: string } {
  const {
    minLength = 0,
    maxLength = Infinity,
    required = true,
    lettersOnly = false,
    numbersOnly = false,
    allowSpecialChars = true,
    pattern,
    customValidator
  } = criteria;

  // Check if required and empty
  if (required && input.trim() === '') {
    return { isValid: false, error: 'This field is required' };
  }

  // Check minimum length
  if (input.length < minLength) {
    return { 
      isValid: false, 
      error: `Must be at least ${minLength} character${minLength === 1 ? '' : 's'}` 
    };
  }

  // Check maximum length
  if (input.length > maxLength) {
    return { 
      isValid: false, 
      error: `Must be no more than ${maxLength} character${maxLength === 1 ? '' : 's'}` 
    };
  }

  // Check letters only
  if (lettersOnly && !/^[a-zA-Z\s]*$/.test(input)) {
    return { isValid: false, error: 'Only letters and spaces are allowed' };
  }

  // Check numbers only
  if (numbersOnly && !/^\d*$/.test(input)) {
    return { isValid: false, error: 'Only numbers are allowed' };
  }

  // Check special characters
  if (!allowSpecialChars && !lettersOnly && !numbersOnly && /[^a-zA-Z0-9\s]/.test(input)) {
    return { isValid: false, error: 'Special characters are not allowed' };
  }

  // Check custom pattern
  if (pattern && !pattern.test(input)) {
    return { isValid: false, error: 'Invalid format' };
  }

  // Check custom validator
  if (customValidator && !customValidator(input)) {
    return { isValid: false, error: 'Invalid input' };
  }

  return { isValid: true };
}

export const ValidationPresets = {
  name: { minLength: 2, maxLength: 50, lettersOnly: true },
  email: { 
    minLength: 5, 
    maxLength: 100, 
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ 
  },
  password: { 
    minLength: 6, 
    maxLength: 50, 
    allowSpecialChars: true,
    customValidator: (input: string) => !input.includes(' ')
  },
  groupName: { minLength: 2, maxLength: 100 },
  description: { minLength: 0, maxLength: 500, required: false },
  graduationYear: { 
    minLength: 4, 
    maxLength: 4, 
    numbersOnly: true,
    customValidator: (input: string) => {
      const year = parseInt(input);
      const currentYear = new Date().getFullYear();
      return year >= 1900 && year <= currentYear + 10;
    }
  }
} as const;
