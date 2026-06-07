import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ChatThreadMessage } from '@/features/ai/types';
import { zustandStorage } from '@/services/storage.service';
import { uid } from '@/utils/id';

interface ChatState {
  messages: ChatThreadMessage[];
  addUser: (content: string) => string;
  /** Create an empty assistant message (streaming) and return its id. */
  startAssistant: () => string;
  appendAssistant: (id: string, delta: string) => void;
  finishAssistant: (id: string, model?: string) => void;
  setAssistant: (id: string, content: string) => void;
  clear: () => void;
}

const STORAGE_KEY = 'fitbmi.chat';

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [],
      addUser: (content) => {
        const id = uid('msg');
        set((s) => ({
          messages: [
            ...s.messages,
            { id, role: 'user', content, createdAt: Date.now() },
          ],
        }));
        return id;
      },
      startAssistant: () => {
        const id = uid('msg');
        set((s) => ({
          messages: [
            ...s.messages,
            {
              id,
              role: 'assistant',
              content: '',
              createdAt: Date.now(),
              streaming: true,
            },
          ],
        }));
        return id;
      },
      appendAssistant: (id, delta) =>
        set((s) => ({
          messages: s.messages.map((m) =>
            m.id === id ? { ...m, content: m.content + delta } : m,
          ),
        })),
      setAssistant: (id, content) =>
        set((s) => ({
          messages: s.messages.map((m) =>
            m.id === id ? { ...m, content } : m,
          ),
        })),
      finishAssistant: (id, model) =>
        set((s) => ({
          messages: s.messages.map((m) =>
            m.id === id ? { ...m, streaming: false, model } : m,
          ),
        })),
      clear: () => set({ messages: [] }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
