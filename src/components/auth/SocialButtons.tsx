import React, { memo } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Apple, Chrome, Facebook } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useHaptics } from '@/hooks/useHaptics';
import { radius } from '@/theme';
import { Text } from '@/components/ui/Text';

/** Social login buttons (UI only — wire to a provider later). */
function SocialButtonsComponent() {
  const { colors } = useTheme();
  const haptic = useHaptics();
  const providers = [
    { name: 'Google', Icon: Chrome },
    { name: 'Apple', Icon: Apple },
    { name: 'Facebook', Icon: Facebook },
  ];

  return (
    <View style={{ gap: 12 }}>
      <View style={styles.divider}>
        <View style={[styles.line, { backgroundColor: colors.border }]} />
        <Text variant="label" tone="muted">
          or continue with
        </Text>
        <View style={[styles.line, { backgroundColor: colors.border }]} />
      </View>
      <View style={styles.row}>
        {providers.map(({ name, Icon }) => (
          <Pressable
            key={name}
            accessibilityRole="button"
            accessibilityLabel={`Continue with ${name}`}
            onPress={() => haptic('light')}
            style={[
              styles.btn,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Icon size={22} color={colors.text} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  line: { flex: 1, height: StyleSheet.hairlineWidth },
  row: { flexDirection: 'row', gap: 12, justifyContent: 'center' },
  btn: {
    flex: 1,
    height: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const SocialButtons = memo(SocialButtonsComponent);
