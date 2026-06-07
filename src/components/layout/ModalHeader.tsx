import React, { memo } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Text } from '@/components/ui/Text';

interface ModalHeaderProps {
  title: string;
}

function ModalHeaderComponent({ title }: ModalHeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  return (
    <View style={[styles.row, { paddingTop: insets.top + 8 }]}>
      <Text variant="h3" accessibilityRole="header">
        {title}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Close"
        hitSlop={10}
        onPress={() => router.back()}
        style={[styles.close, { backgroundColor: colors.surfaceAlt }]}
      >
        <X size={20} color={colors.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  close: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const ModalHeader = memo(ModalHeaderComponent);
