import React, { memo } from 'react';
import { MotiView } from 'moti';
import type { ViewStyle } from 'react-native';
import { GlassCard } from './GlassCard';

interface AnimatedCardProps {
  children: React.ReactNode;
  /** Stagger index for sequenced entrance animations. */
  index?: number;
  delay?: number;
  padded?: boolean;
  style?: ViewStyle | ViewStyle[];
}

/** GlassCard with a Moti fade + rise entrance, staggered by index. */
function AnimatedCardComponent({
  children,
  index = 0,
  delay = 80,
  padded = true,
  style,
}: AnimatedCardProps) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 24, scale: 0.98 }}
      animate={{ opacity: 1, translateY: 0, scale: 1 }}
      transition={{
        type: 'timing',
        duration: 450,
        delay: index * delay,
      }}
    >
      <GlassCard padded={padded} style={style}>
        {children}
      </GlassCard>
    </MotiView>
  );
}

export const AnimatedCard = memo(AnimatedCardComponent);
