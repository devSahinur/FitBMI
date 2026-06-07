import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { useTheme } from '@/hooks/useTheme';

/** Three-dot typing indicator for the AI coach. */
function TypingDotsComponent() {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      {[0, 1, 2].map((i) => (
        <MotiView
          key={i}
          from={{ opacity: 0.3, translateY: 0 }}
          animate={{ opacity: 1, translateY: -3 }}
          transition={{
            loop: true,
            type: 'timing',
            duration: 450,
            delay: i * 150,
          }}
          style={[styles.dot, { backgroundColor: colors.textMuted }]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 4, paddingVertical: 6 },
  dot: { width: 7, height: 7, borderRadius: 4 },
});

export const TypingDots = memo(TypingDotsComponent);
