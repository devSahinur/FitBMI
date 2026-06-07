import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { Bot, User } from 'lucide-react-native';
import { palette, radius } from '@/theme';
import { useTheme } from '@/hooks/useTheme';
import { Text } from '@/components/ui/Text';
import { Markdown } from './Markdown';
import { TypingDots } from './TypingDots';
import type { ChatThreadMessage } from '@/features/ai/types';

interface ChatBubbleProps {
  message: ChatThreadMessage;
}

/** A single chat message with avatar, supporting streaming + markdown. */
function ChatBubbleComponent({ message }: ChatBubbleProps) {
  const { colors } = useTheme();
  const isUser = message.role === 'user';
  const showTyping = message.streaming && message.content.length === 0;

  return (
    <MotiView
      from={{ opacity: 0, translateY: 8 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 250 }}
      style={[styles.row, isUser ? styles.rowUser : styles.rowBot]}
    >
      {!isUser && (
        <LinearGradient
          colors={[palette.primary, palette.secondary]}
          style={styles.avatar}
        >
          <Bot size={16} color="#fff" />
        </LinearGradient>
      )}

      <View style={styles.bubbleWrap}>
        {isUser ? (
          <LinearGradient
            colors={[palette.secondary, palette.secondaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.bubble, styles.userBubble]}
          >
            <Text variant="body" style={{ color: '#fff' }}>
              {message.content}
            </Text>
          </LinearGradient>
        ) : (
          <View
            style={[
              styles.bubble,
              styles.botBubble,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            {showTyping ? (
              <TypingDots />
            ) : (
              <Markdown content={message.content} />
            )}
            {message.model && !message.streaming ? (
              <Text variant="label" tone="muted" style={styles.model}>
                {message.model.split('/').pop()}
              </Text>
            ) : null}
          </View>
        )}
      </View>

      {isUser && (
        <View style={[styles.avatar, { backgroundColor: colors.surfaceAlt }]}>
          <User size={16} color={colors.primary} />
        </View>
      )}
    </MotiView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8, marginVertical: 6, alignItems: 'flex-end' },
  rowUser: { justifyContent: 'flex-end' },
  rowBot: { justifyContent: 'flex-start' },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubbleWrap: { flexShrink: 1, maxWidth: '82%' },
  bubble: {
    borderRadius: radius.lg,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  userBubble: { borderBottomRightRadius: 4 },
  botBubble: { borderBottomLeftRadius: 4, borderWidth: StyleSheet.hairlineWidth },
  model: { marginTop: 6, opacity: 0.7 },
});

export const ChatBubble = memo(ChatBubbleComponent);
