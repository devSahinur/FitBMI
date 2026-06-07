import React, { memo } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';

import { ModalHeader } from '@/components/layout/ModalHeader';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/hooks/useTheme';

interface AuthScaffoldProps {
  title: string;
  subtitle?: string;
  headerTitle?: string;
  children: React.ReactNode;
}

/** Shared layout for auth screens (UI only). */
function AuthScaffoldComponent({
  title,
  subtitle,
  headerTitle = '',
  children,
}: AuthScaffoldProps) {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const bg = isDark
    ? (['#0B0F1A', '#0E1626'] as const)
    : (['#F4F6FA', '#EAF0FA'] as const);

  return (
    <LinearGradient colors={bg} style={styles.fill}>
      <ModalHeader title={headerTitle} />
      <KeyboardAvoidingView
        style={styles.fill}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{
            padding: 24,
            paddingBottom: insets.bottom + 32,
            gap: 20,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <MotiView
            from={{ opacity: 0, translateY: 12 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 400 }}
            style={{ gap: 6 }}
          >
            <Text variant="h1">{title}</Text>
            {subtitle ? (
              <Text variant="body" tone="muted">
                {subtitle}
              </Text>
            ) : null}
          </MotiView>
          <View style={{ gap: 16 }}>{children}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({ fill: { flex: 1 } });

export const AuthScaffold = memo(AuthScaffoldComponent);
