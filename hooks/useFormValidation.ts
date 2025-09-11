import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

interface ValidationRule {
  (value: any): boolean;
}

interface ValidationConfig {
  [key: string]: {
    rule: ValidationRule;
    errorMessage: string;
  };
}

interface FormData {
  [key: string]: any;
}

interface UseFormValidationReturn {
  validateField: (fieldName: string, value: any) => boolean;
  validateForm: (data: FormData) => boolean;
  showValidationAlert: (fieldName: string, customMessage?: string) => void;
  isFieldValid: (fieldName: string, value: any) => boolean;
  getFieldError: (fieldName: string, value: any) => string | null;
}

export const useFormValidation = (config: ValidationConfig): UseFormValidationReturn => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = useCallback((fieldName: string, value: any): boolean => {
    const fieldConfig = config[fieldName];
    if (!fieldConfig) return true;

    const isValid = fieldConfig.rule(value);
    if (!isValid) {
      setErrors(prev => ({ ...prev, [fieldName]: fieldConfig.errorMessage }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
    return isValid;
  }, [config]);

  const validateForm = useCallback((data: FormData): boolean => {
    let isValid = true;
    const newErrors: Record<string, string> = {};

    for (const [fieldName, value] of Object.entries(data)) {
      const fieldConfig = config[fieldName];
      if (fieldConfig && !fieldConfig.rule(value)) {
        isValid = false;
        newErrors[fieldName] = fieldConfig.errorMessage;
      }
    }

    setErrors(newErrors);
    return isValid;
  }, [config]);

  const showValidationAlert = useCallback((fieldName: string, customMessage?: string) => {
    const fieldConfig = config[fieldName];
    const message = customMessage || fieldConfig?.errorMessage || 'Invalid input';
    Alert.alert('Validation Error', message);
  }, [config]);

  const isFieldValid = useCallback((fieldName: string, value: any): boolean => {
    const fieldConfig = config[fieldName];
    if (!fieldConfig) return true;
    return fieldConfig.rule(value);
  }, [config]);

  const getFieldError = useCallback((fieldName: string, value: any): string | null => {
    const fieldConfig = config[fieldName];
    if (!fieldConfig || fieldConfig.rule(value)) return null;
    return fieldConfig.errorMessage;
  }, [config]);

  return {
    validateField,
    validateForm,
    showValidationAlert,
    isFieldValid,
    getFieldError,
  };
};

// Custom validation helper
export const createValidationConfig = {
  custom: (rules: ValidationConfig) => rules
};

export default useFormValidation;

/*
// 2. Custom Validation Rules
const CustomForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [age, setAge] = useState('')

  const customConfig = createValidationConfig.custom({
    email: {
      rule: validationRules.email,
      errorMessage: 'Please enter a valid email address'
    },
    password: {
      rule: validationRules.password,
      errorMessage: 'Password must be at least 8 characters'
    },
    confirmPassword: {
      rule: (value) => value === password,
      errorMessage: 'Passwords do not match'
    },
    age: {
      rule: (value) => {
        const ageNum = parseInt(value)
        return !isNaN(ageNum) && ageNum >= 18 && ageNum <= 100
      },
      errorMessage: 'Age must be between 18-100'
    }
  })

  const { validateForm, showValidationAlert, isFieldValid } = useFormValidation(customConfig)

  const handleSubmit = () => {
    const formData = { email, password, confirmPassword, age }
    
    if (!validateForm(formData)) {
      // Show specific error for first invalid field
      if (!isFieldValid('email', email)) {
        showValidationAlert('email')
        return
      }
      if (!isFieldValid('password', password)) {
        showValidationAlert('password')
        return
      }
      if (!isFieldValid('confirmPassword', confirmPassword)) {
        showValidationAlert('confirmPassword')
        return
      }
      if (!isFieldValid('age', age)) {
        showValidationAlert('age')
        return
      }
    }

    console.log('Custom form is valid!', formData)
  }

  return (
    <View>
      <TextInput value={email} onChangeText={setEmail} placeholder="Email" />
      <TextInput value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry />
      <TextInput value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Confirm Password" secureTextEntry />
      <TextInput value={age} onChangeText={setAge} placeholder="Age" keyboardType="numeric" />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  )
}

// 3. Real-time Field Validation
const RealTimeForm = () => {
  const [username, setUsername] = useState('')
  const [phone, setPhone] = useState('')

  const realTimeConfig = createValidationConfig.custom({
    username: {
      rule: (value) => value.length >= 3 && value.length <= 20,
      errorMessage: 'Username must be 3-20 characters'
    },
    phone: {
      rule: (value) => /^\d{10}$/.test(value),
      errorMessage: 'Phone must be exactly 10 digits'
    }
  })

  const { validateField, getFieldError } = useFormValidation(realTimeConfig)

  const handleUsernameChange = (value) => {
    setUsername(value)
    validateField('username', value)
  }

  const handlePhoneChange = (value) => {
    setPhone(value)
    validateField('phone', value)
  }

  return (
    <View>
      <TextInput 
        value={username} 
        onChangeText={handleUsernameChange} 
        placeholder="Username" 
      />
      {getFieldError('username', username) && (
        <Text style={{color: 'red'}}>{getFieldError('username', username)}</Text>
      )}
      
      <TextInput 
        value={phone} 
        onChangeText={handlePhoneChange} 
        placeholder="Phone" 
        keyboardType="phone-pad"
      />
      {getFieldError('phone', phone) && (
        <Text style={{color: 'red'}}>{getFieldError('phone', phone)}</Text>
      )}
    </View>
  )
}

// 4. Mixed Pre-configured and Custom Rules
const MixedForm = () => {
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [bio, setBio] = useState('')

  const mixedConfig = {
    ...createValidationConfig.profileSetup, // Include pre-configured rules
    email: {
      rule: validationRules.email,
      errorMessage: 'Please enter a valid email address'
    },
    bio: {
      rule: (value) => !value || value.length <= 500,
      errorMessage: 'Bio must be less than 500 characters'
    }
  }

  const { validateForm, showValidationAlert } = useFormValidation(mixedConfig)

  const handleSubmit = () => {
    const formData = { firstName, email, bio }
    
    if (!validateForm(formData)) {
      // Handle validation errors
      if (!validationRules.firstName(firstName)) {
        showValidationAlert('firstName')
        return
      }
      if (!validationRules.email(email)) {
        showValidationAlert('email')
        return
      }
      if (!mixedConfig.bio.rule(bio)) {
        showValidationAlert('bio')
        return
      }
    }

    console.log('Mixed form is valid!', formData)
  }

  return (
    <View>
      <TextInput value={firstName} onChangeText={setFirstName} placeholder="First Name" />
      <TextInput value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" />
      <TextInput value={bio} onChangeText={setBio} placeholder="Bio" multiline />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  )
}
*/

