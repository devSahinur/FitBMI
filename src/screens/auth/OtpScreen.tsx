import React, { useRef, useState } from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { AuthScaffold } from '@/components/auth/AuthScaffold';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/hooks/useTheme';
import { radius } from '@/theme';

const LENGTH = 6;

export function OtpScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [code, setCode] = useState('');
  const inputRef = useRef<TextInput>(null);

  const digits = Array.from({ length: LENGTH }, (_, i) => code[i] ?? '');

  return (
    <AuthScaffold
      title="Verify code"
      subtitle="Enter the 6-digit code we sent to your email."
    >
      <Pressable onPress={() => inputRef.current?.focus()} style={styles.cells}>
        {digits.map((d, i) => {
          const active = i === code.length;
          return (
            <View
              key={i}
              style={[
                styles.cell,
                {
                  backgroundColor: colors.surfaceAlt,
                  borderColor: active ? colors.primary : 'transparent',
                },
              ]}
            >
              <Text variant="h2">{d}</Text>
            </View>
          );
        })}
      </Pressable>

      <TextInput
        ref={inputRef}
        value={code}
        onChangeText={(t) => setCode(t.replace(/[^0-9]/g, '').slice(0, LENGTH))}
        keyboardType="number-pad"
        maxLength={LENGTH}
        autoFocus
        style={styles.hiddenInput}
        caretHidden
      />

      <Button
        title="Verify"
        disabled={code.length < LENGTH}
        onPress={() => router.replace('/(tabs)')}
      />

      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 4 }}>
        <Text variant="caption" tone="muted">
          Didn’t get a code?
        </Text>
        <Pressable hitSlop={8} onPress={() => setCode('')}>
          <Text variant="caption" tone="primary">
            Resend
          </Text>
        </Pressable>
      </View>
    </AuthScaffold>
  );
}

const styles = StyleSheet.create({
  cells: { flexDirection: 'row', gap: 10, justifyContent: 'space-between' },
  cell: {
    flex: 1,
    aspectRatio: 0.85,
    borderRadius: radius.md,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hiddenInput: { height: 1, opacity: 0 },
});
