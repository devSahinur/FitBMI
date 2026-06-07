import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/**
 * Tracks the OS "Reduce Motion" accessibility setting so animations can be
 * shortened or disabled. Returns true when the user prefers reduced motion.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((v) => mounted && setReduced(v))
      .catch(() => undefined);

    const sub = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (v) => setReduced(v),
    );
    return () => {
      mounted = false;
      sub.remove();
    };
  }, []);

  return reduced;
}
