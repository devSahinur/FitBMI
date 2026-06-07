import React, { memo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { MotiView, AnimatePresence } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Plus, type LucideIcon } from 'lucide-react-native';
import { palette, radius, shadows } from '@/theme';
import { useTheme } from '@/hooks/useTheme';
import { useHaptics } from '@/hooks/useHaptics';
import { Text } from './Text';

export interface FABAction {
  label: string;
  icon: LucideIcon;
  color?: string;
  onPress: () => void;
}

interface ExpandableFABProps {
  actions: FABAction[];
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** Expandable speed-dial FAB with labelled actions. */
function ExpandableFABComponent({ actions }: ExpandableFABProps) {
  const { colors } = useTheme();
  const haptic = useHaptics();
  const [open, setOpen] = useState(false);
  const rotate = useSharedValue(0);

  const toggle = () => {
    haptic('medium');
    const next = !open;
    setOpen(next);
    rotate.value = withSpring(next ? 1 : 0, { damping: 14 });
  };

  const close = () => {
    setOpen(false);
    rotate.value = withTiming(0);
  };

  const plusStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value * 45}deg` }],
  }));

  return (
    <>
      {open && (
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={close}
          accessibilityLabel="Close menu"
        />
      )}
      <View style={styles.wrap} pointerEvents="box-none">
        <AnimatePresence>
          {open &&
            actions.map((action, i) => {
              const Icon = action.icon;
              const accent = action.color ?? colors.primary;
              return (
                <MotiView
                  key={action.label}
                  from={{ opacity: 0, translateY: 12, scale: 0.8 }}
                  animate={{ opacity: 1, translateY: 0, scale: 1 }}
                  exit={{ opacity: 0, translateY: 12, scale: 0.8 }}
                  transition={{ type: 'spring', damping: 15, delay: i * 35 }}
                  style={styles.actionRow}
                >
                  <View
                    style={[styles.labelPill, { backgroundColor: colors.surface }]}
                  >
                    <Text variant="label">{action.label}</Text>
                  </View>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={action.label}
                    onPress={() => {
                      close();
                      action.onPress();
                    }}
                    style={[styles.actionBtn, { backgroundColor: accent }, shadows.sm]}
                  >
                    <Icon size={20} color="#fff" />
                  </Pressable>
                </MotiView>
              );
            })}
        </AnimatePresence>

        <AnimatedPressable
          accessibilityRole="button"
          accessibilityLabel={open ? 'Close actions' : 'Add entry'}
          onPress={toggle}
          style={[styles.fab, shadows.glow]}
        >
          <LinearGradient
            colors={[palette.primary, palette.secondary]}
            style={styles.fabGradient}
          >
            <Animated.View style={plusStyle}>
              <Plus size={28} color="#fff" />
            </Animated.View>
          </LinearGradient>
        </AnimatedPressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', right: 20, bottom: 24, alignItems: 'flex-end', gap: 12 },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  labelPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    ...shadows.sm,
  },
  actionBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: { borderRadius: 32 },
  fabGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const ExpandableFAB = memo(ExpandableFABComponent);
