import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ModalHeader } from '@/components/layout/ModalHeader';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/hooks/useTheme';

export interface Section {
  heading: string;
  body: string;
}

interface LegalScreenProps {
  title: string;
  updated: string;
  sections: Section[];
  footer?: string;
}

/** Shared scrollable document layout for Privacy / Terms / About. */
export function LegalScreen({ title, updated, sections, footer }: LegalScreenProps) {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const bg = isDark
    ? (['#0B0F1A', '#0E1626'] as const)
    : (['#F4F6FA', '#EAF0FA'] as const);

  return (
    <LinearGradient colors={bg} style={styles.fill}>
      <ModalHeader title={title} />
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: insets.bottom + 32,
          gap: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="caption" tone="muted">
          Last updated: {updated}
        </Text>
        {sections.map((s) => (
          <View key={s.heading} style={{ gap: 6 }}>
            <Text variant="title">{s.heading}</Text>
            <Text variant="body" tone="muted">
              {s.body}
            </Text>
          </View>
        ))}
        {footer ? (
          <Text variant="caption" tone="muted" style={styles.footer}>
            {footer}
          </Text>
        ) : null}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  footer: { marginTop: 8, fontStyle: 'italic' },
});
