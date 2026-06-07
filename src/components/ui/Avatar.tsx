import React, { memo } from 'react';
import { Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { palette } from '@/theme';
import { Text } from './Text';

interface AvatarProps {
  uri?: string;
  name?: string;
  size?: number;
}

/** User avatar — image when available, gradient initials otherwise. */
function AvatarComponent({ uri, name = '', size = 64 }: AvatarProps) {
  const initials = name
    .split(' ')
    .map((p) => p.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        accessibilityLabel={`${name} avatar`}
      />
    );
  }

  return (
    <LinearGradient
      colors={[palette.primary, palette.secondary]}
      style={[styles.fallback, { width: size, height: size, borderRadius: size / 2 }]}
    >
      <Text variant="h3" style={{ color: '#fff' }}>
        {initials || '🙂'}
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fallback: { alignItems: 'center', justifyContent: 'center' },
});

export const Avatar = memo(AvatarComponent);
