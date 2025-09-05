import React from 'react';
import { View, ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cn } from '@/lib/utils';

interface PageProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
  safeAreaTop?: boolean;
  safeAreaBottom?: boolean;
  safeAreaLeft?: boolean;
  safeAreaRight?: boolean;
  padding?: boolean;
}

/**
 * A reusable page component with safe area handling and consistent styling.
 * 
 * @component
 * @example
 * ```tsx
 * <Page>
 *   <Text>Page content</Text>
 * </Page>
 * ```
 * 
 * @param {React.ReactNode} children - The content to render inside the page
 * @param {string} className - Additional Tailwind classes to apply
 * @param {boolean} safeAreaTop - Whether to apply top safe area inset (default: true)
 * @param {boolean} safeAreaBottom - Whether to apply bottom safe area inset (default: true)
 * @param {boolean} safeAreaLeft - Whether to apply left safe area inset (default: true)
 * @param {boolean} safeAreaRight - Whether to apply right safe area inset (default: true)
 * @param {boolean} padding - Whether to apply default padding (default: true)
 */
export function Page({
  children,
  className,
  safeAreaTop = true,
  safeAreaBottom = true,
  safeAreaLeft = true,
  safeAreaRight = true,
  padding = true,
  style,
  ...props
}: PageProps) {
  const insets = useSafeAreaInsets();

  const safeAreaStyle = {
    paddingTop: safeAreaTop ? insets.top : 0,
    paddingBottom: safeAreaBottom ? insets.bottom : 0,
    paddingLeft: safeAreaLeft ? insets.top * 0.35 : 0,
    paddingRight: safeAreaRight ? insets.top * 0.35 : 0,
  };

  return (
    <View
      className={cn(
        'flex-1 bg-background',
        padding && 'px-4 py-6',
        className
      )}
      style={[safeAreaStyle, style]}
      {...props}
    >
      {children}
    </View>
  );
}
