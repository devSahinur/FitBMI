import { useCallback, useRef, useState } from 'react';
import {
  streamChatCompletion,
  hasApiKey,
  type ChatMessage,
} from '@/services/openrouter.service';
import { coachSystemPrompt } from '@/features/ai/prompts';
import { useChatStore } from '@/store/chat.store';
import {
  useGamificationStore,
  DAILY_CHALLENGES,
} from '@/store/gamification.store';
import { useAIContext } from './useAIContext';

/** Drives the AI Health Coach chat with streaming responses. */
export function useChat() {
  const ctx = useAIContext();
  const messages = useChatStore((s) => s.messages);
  const clear = useChatStore((s) => s.clear);
  const awardXp = useGamificationStore((s) => s.awardXp);

  const [sending, setSending] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || sending) return;

      const store = useChatStore.getState();
      store.addUser(trimmed);
      const assistantId = store.startAssistant();
      setSending(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        if (!hasApiKey()) {
          store.setAssistant(
            assistantId,
            '⚠️ No AI key configured.\n\nAdd `EXPO_PUBLIC_OPENROUTER_API_KEY` to your `.env` file (see `.env.example`) and restart the dev server to chat with your AI coach.',
          );
          store.finishAssistant(assistantId);
          return;
        }

        const history: ChatMessage[] = useChatStore
          .getState()
          .messages.filter((m) => !m.streaming)
          .map((m) => ({ role: m.role, content: m.content }));

        const payload: ChatMessage[] = [
          { role: 'system', content: coachSystemPrompt(ctx) },
          ...history,
        ];

        const { model } = await streamChatCompletion(
          payload,
          (delta) => useChatStore.getState().appendAssistant(assistantId, delta),
          { signal: controller.signal },
        );
        useChatStore.getState().finishAssistant(assistantId, model);
        awardXp(5, 'AI coach chat');
        useGamificationStore.getState().completeChallenge(DAILY_CHALLENGES[2]!);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Something went wrong.';
        useChatStore.getState().setAssistant(assistantId, `⚠️ ${msg}`);
        useChatStore.getState().finishAssistant(assistantId);
      } finally {
        setSending(false);
        abortRef.current = null;
      }
    },
    [ctx, sending, awardXp],
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return { messages, send, stop, sending, clear };
}
