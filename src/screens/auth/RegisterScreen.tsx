import React, { useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Check } from 'lucide-react-native';

import { AuthScaffold } from '@/components/auth/AuthScaffold';
import { SocialButtons } from '@/components/auth/SocialButtons';
import { Field } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { useHaptics } from '@/hooks/useHaptics';

const AVATARS: readonly [string, string][] = [
  ['#00C897', '#00A8FF'],
  ['#9D7BFF', '#7C5CFC'],
  ['#FFB800', '#FF9F1C'],
  ['#FF5C8A', '#E11D74'],
  ['#00D26A', '#00A87E'],
];

export function RegisterScreen() {
  const router = useRouter();
  const haptic = useHaptics();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(0);

  return (
    <AuthScaffold
      title="Create account"
      subtitle="Start tracking your health in minutes."
    >
      <Text variant="label" tone="muted">
        Choose an avatar
      </Text>
      <View style={styles.avatars}>
        {AVATARS.map((colors, i) => (
          <Pressable
            key={i}
            onPress={() => {
              haptic('light');
              setAvatar(i);
            }}
            accessibilityRole="button"
            accessibilityState={{ selected: avatar === i }}
          >
            <LinearGradient colors={colors} style={styles.avatar}>
              {avatar === i ? <Check size={20} color="#fff" /> : null}
            </LinearGradient>
          </Pressable>
        ))}
      </View>

      <Field label="Name" placeholder="Your name" value={name} onChangeText={setName} />
      <Field
        label="Email"
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <Field
        label="Password"
        placeholder="••••••••"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Create Account" onPress={() => router.push('/auth/otp')} />
      <SocialButtons />

      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 4 }}>
        <Text variant="caption" tone="muted">
          Already have an account?
        </Text>
        <Pressable onPress={() => router.replace('/auth/login')} hitSlop={8}>
          <Text variant="caption" tone="primary">
            Sign in
          </Text>
        </Pressable>
      </View>
    </AuthScaffold>
  );
}

const styles = StyleSheet.create({
  avatars: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
