import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { FlashList, type FlashListRef } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Send, Square, Trash2, Sparkles } from 'lucide-react-native';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { EmptyState } from '@/components/layout/EmptyState';
import { Text } from '@/components/ui/Text';
import { Chip } from '@/components/ui/Chip';
import { ChatBubble } from '@/components/ai/ChatBubble';
import { useTheme } from '@/hooks/useTheme';
import { useChat } from '@/hooks/useChat';
import { useHaptics } from '@/hooks/useHaptics';
import { palette, radius } from '@/theme';
import { HEALTH_DISCLAIMER } from '@/features/ai/prompts';
import type { ChatThreadMessage } from '@/features/ai/types';

const SUGGESTIONS = [
  'What should my healthy weight be?',
  'How much water should I drink?',
  'Give me a quick fitness tip',
  'Explain my BMI',
];

export function CoachScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const haptic = useHaptics();
  const { messages, send, stop, sending, clear } = useChat();
  const [input, setInput] = useState('');
  const listRef = useRef<FlashListRef<ChatThreadMessage>>(null);

  const onSend = useCallback(
    (text?: string) => {
      const value = (text ?? input).trim();
      if (!value) return;
      haptic('light');
      setInput('');
      void send(value);
      requestAnimationFrame(() =>
        listRef.current?.scrollToEnd?.({ animated: true }),
      );
    },
    [input, send, haptic],
  );

  const confirmClear = () => {
    if (messages.length === 0) return;
    Alert.alert('Clear chat', 'Delete the whole conversation?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: clear },
    ]);
  };

  return (
    <ScreenContainer scroll={false}>
      {/* Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={[palette.primary, palette.secondary]}
          style={styles.headerIcon}
        >
          <Sparkles size={18} color="#fff" />
        </LinearGradient>
        <View style={{ flex: 1 }}>
          <Text variant="h3">AI Health Coach</Text>
          <Text variant="label" tone="muted" numberOfLines={1}>
            {HEALTH_DISCLAIMER}
          </Text>
        </View>
        <Pressable hitSlop={8} onPress={confirmClear} accessibilityLabel="Clear chat">
          <Trash2 size={20} color={colors.textMuted} />
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        {messages.length === 0 ? (
          <ScrollView contentContainerStyle={styles.empty}>
            <EmptyState
              icon="Bot"
              title="Ask your AI coach"
              message="Personalised fitness, nutrition and wellness guidance based on your profile."
            />
            <View style={styles.suggestions}>
              {SUGGESTIONS.map((s) => (
                <Chip key={s} label={s} onPress={() => onSend(s)} />
              ))}
            </View>
          </ScrollView>
        ) : (
          <FlashList
            ref={listRef}
            data={messages}
            keyExtractor={(m) => m.id}
            renderItem={({ item }) => <ChatBubble message={item} />}
            contentContainerStyle={{ paddingVertical: 8 }}
            onContentSizeChange={() =>
              listRef.current?.scrollToEnd?.({ animated: true })
            }
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Input bar */}
        <View
          style={[
            styles.inputBar,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              marginBottom: insets.bottom + 70,
            },
          ]}
        >
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Message your coach…"
            placeholderTextColor={colors.textMuted}
            value={input}
            onChangeText={setInput}
            multiline
            onSubmitEditing={() => onSend()}
          />
          {sending ? (
            <Pressable
              onPress={stop}
              style={[styles.sendBtn, { backgroundColor: colors.surfaceAlt }]}
              accessibilityLabel="Stop"
            >
              <Square size={18} color={colors.text} />
            </Pressable>
          ) : (
            <Pressable
              onPress={() => onSend()}
              disabled={!input.trim()}
              accessibilityLabel="Send"
            >
              <LinearGradient
                colors={[palette.primary, palette.secondary]}
                style={[styles.sendBtn, { opacity: input.trim() ? 1 : 0.4 }]}
              >
                <Send size={18} color="#fff" />
              </LinearGradient>
            </Pressable>
          )}
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 8,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: { paddingTop: 24 },
  suggestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.lg,
    padding: 8,
  },
  input: {
    flex: 1,
    maxHeight: 120,
    fontSize: 15,
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
