import { cn } from '@/lib/utils';
import { Platform, TextInput, type TextInputProps, View } from 'react-native';
import { Text } from './text';
import { useState, useEffect } from 'react';

interface InputProps extends TextInputProps {
  maxLength?: number;
  showCounter?: boolean;
  counterFormat?: (current: number, max: number) => string;
  showCounterWhenNearLimit?: boolean;
  counterThreshold?: number;
  inputHeight?: number;
}

function Input({
  className,
  placeholderClassName,
  maxLength,
  showCounter = true,
  counterFormat,
  showCounterWhenNearLimit = true,
  counterThreshold = 0.8,
  inputHeight,
  value,
  ...props
}: InputProps & React.RefAttributes<TextInput>) {
  const [currentLength, setCurrentLength] = useState(0);

  useEffect(() => {
    setCurrentLength(value?.length || 0);
  }, [value]);

  const shouldShowCounter = showCounter && maxLength && (
    !showCounterWhenNearLimit || 
    currentLength >= (maxLength * counterThreshold)
  );

  const defaultCounterFormat = (current: number, max: number) => `${current}/${max}`;
  const formatCounter = counterFormat || defaultCounterFormat;

  const isNearLimit = maxLength && currentLength >= (maxLength * 0.9);
  const isAtLimit = maxLength && currentLength >= maxLength;

  return (
    <View className="w-full">
          {shouldShowCounter && (
        <View className="flex-row justify-end">
          <Text 
            className={cn(
              'text-xs',
              isAtLimit ? 'text-red-500' : isNearLimit ? 'text-yellow-500' : 'text-muted-foreground'
            )}
          >
            {formatCounter(currentLength, maxLength!)}
          </Text>
        </View>
      )}
      <TextInput
        className={cn(
          'dark:bg-input/30 border-input bg-background text-foreground flex w-full min-w-0 flex-row items-center rounded-md border px-3 py-1 text-base leading-5 shadow-sm shadow-black/5',
          // Default height classes
          !inputHeight && 'h-10 sm:h-9',
          // Custom height if provided
          inputHeight && `h-[${inputHeight}px]`,
          props.editable === false &&
            cn(
              'opacity-50',
              Platform.select({ web: 'disabled:pointer-events-none disabled:cursor-not-allowed' })
            ),
          Platform.select({
            web: cn(
              'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground outline-none transition-[color,box-shadow] md:text-sm',
              'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
              'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive'
            ),
            native: 'placeholder:text-muted-foreground/50',
          }),
          isAtLimit && 'border-red-500',
          isNearLimit && !isAtLimit && 'border-yellow-500',
          className
        )}
        style={inputHeight ? { height: inputHeight } : undefined}
        maxLength={maxLength}
        value={value}
        {...props}
      />
  
    </View>
  );
}

export { Input };
