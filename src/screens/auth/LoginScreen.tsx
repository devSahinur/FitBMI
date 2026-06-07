import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

import { AuthScaffold } from '@/components/auth/AuthScaffold';
import { SocialButtons } from '@/components/auth/SocialButtons';
import { Field } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';

export function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <AuthScaffold
      title="Welcome back"
      subtitle="Sign in to continue your health journey."
    >
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
      <Pressable
        onPress={() => router.push('/auth/forgot')}
        style={{ alignSelf: 'flex-end' }}
        hitSlop={8}
      >
        <Text variant="label" tone="primary">
          Forgot password?
        </Text>
      </Pressable>

      <Button title="Sign In" onPress={() => router.replace('/(tabs)')} />
      <SocialButtons />

      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 4 }}>
        <Text variant="caption" tone="muted">
          Don’t have an account?
        </Text>
        <Pressable onPress={() => router.push('/auth/register')} hitSlop={8}>
          <Text variant="caption" tone="primary">
            Register
          </Text>
        </Pressable>
      </View>
    </AuthScaffold>
  );
}
