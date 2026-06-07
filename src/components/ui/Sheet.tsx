import React, { forwardRef, useCallback, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetScrollView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { useTheme } from '@/hooks/useTheme';
import { radius } from '@/theme';

interface SheetProps {
  children: React.ReactNode;
  snapPoints?: (string | number)[];
  onClose?: () => void;
  /** Use a scrollable body (for long forms + keyboard). */
  scrollable?: boolean;
}

export type SheetRef = BottomSheetModal;

/**
 * Themed bottom sheet built on BottomSheetModal so it renders in a portal
 * above the UI (and never intercepts touches on the screen when closed).
 * Open with ref.present(), close with ref.dismiss().
 */
export const Sheet = forwardRef<BottomSheetModal, SheetProps>(
  ({ children, snapPoints, onClose, scrollable = false }, ref) => {
    const { colors } = useTheme();
    const points = useMemo(() => snapPoints ?? ['55%'], [snapPoints]);

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={0.5}
        />
      ),
      [],
    );

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={points}
        enablePanDownToClose
        onDismiss={onClose}
        backdropComponent={renderBackdrop}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
        backgroundStyle={{
          backgroundColor: colors.surface,
          borderTopLeftRadius: radius.xl,
          borderTopRightRadius: radius.xl,
        }}
        handleIndicatorStyle={{ backgroundColor: colors.textMuted }}
      >
        {scrollable ? (
          <BottomSheetScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </BottomSheetScrollView>
        ) : (
          <BottomSheetView style={styles.content}>{children}</BottomSheetView>
        )}
      </BottomSheetModal>
    );
  },
);

Sheet.displayName = 'Sheet';

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingBottom: 32, gap: 16 },
});
