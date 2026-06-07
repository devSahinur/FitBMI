import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { WifiOff, ServerCrash, TriangleAlert, RefreshCw } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';

type ErrorKind = 'offline' | 'server' | 'generic';

interface ErrorStateProps {
  kind?: ErrorKind;
  title?: string;
  message?: string;
  onRetry?: () => void;
}

const PRESETS: Record<ErrorKind, { Icon: typeof WifiOff; title: string; message: string }> = {
  offline: {
    Icon: WifiOff,
    title: 'No internet connection',
    message: 'Check your network and try again.',
  },
  server: {
    Icon: ServerCrash,
    title: 'Something went wrong',
    message: 'Our service hit a snag. Please try again in a moment.',
  },
  generic: {
    Icon: TriangleAlert,
    title: 'Unexpected error',
    message: 'Please try again.',
  },
};

function ErrorStateComponent({ kind = 'generic', title, message, onRetry }: ErrorStateProps) {
  const { colors } = useTheme();
  const preset = PRESETS[kind];
  const Icon = preset.Icon;

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'timing', duration: 350 }}
      style={styles.wrap}
    >
      <View style={[styles.circle, { backgroundColor: `${colors.error}1A` }]}>
        <Icon size={34} color={colors.error} />
      </View>
      <Text variant="title" style={styles.center}>
        {title ?? preset.title}
      </Text>
      <Text variant="caption" tone="muted" style={styles.center}>
        {message ?? preset.message}
      </Text>
      {onRetry && (
        <Button
          title="Try again"
          fullWidth={false}
          variant="outline"
          icon={<RefreshCw size={16} color={colors.primary} />}
          onPress={onRetry}
          style={styles.retry}
        />
      )}
    </MotiView>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: 40, gap: 8 },
  circle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  center: { textAlign: 'center', maxWidth: 280 },
  retry: { marginTop: 12 },
});

export const ErrorState = memo(ErrorStateComponent);
