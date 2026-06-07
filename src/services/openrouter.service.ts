import { fetch as expoFetch } from 'expo/fetch';

/**
 * OpenRouter client with automatic model fallback and streaming support.
 *
 * Set EXPO_PUBLIC_OPENROUTER_API_KEY in your .env (see .env.example).
 * Streaming uses expo/fetch (Server-Sent Events), which works in Expo Go.
 */

export const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

/**
 * Models tried in priority order until one succeeds.
 * Free (":free") models first, then a couple of low-cost paid fallbacks so the
 * coach keeps working if a free model is rate-limited or unavailable.
 */
export const MODEL_FALLBACK = [
  'deepseek/deepseek-chat-v3-0324:free',
  'meta-llama/llama-3.3-70b-instruct:free',
  'google/gemini-2.0-flash-exp:free',
  'qwen/qwen-2.5-72b-instruct:free',
  // Low-cost paid fallbacks
  'openai/gpt-4o-mini',
  'google/gemini-flash-1.5',
] as const;

export type ChatRole = 'system' | 'user' | 'assistant';

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface CompletionOptions {
  models?: readonly string[];
  temperature?: number;
  maxTokens?: number;
  signal?: AbortSignal;
}

export interface CompletionResult {
  text: string;
  /** The model that actually produced the response. */
  model: string;
}

export class OpenRouterError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = 'OpenRouterError';
  }
}

function apiKey(): string {
  return process.env.EXPO_PUBLIC_OPENROUTER_API_KEY ?? '';
}

/** Whether an API key is configured. UI uses this to degrade gracefully. */
export function hasApiKey(): boolean {
  return apiKey().trim().length > 0;
}

function headers(): Record<string, string> {
  return {
    Authorization: `Bearer ${apiKey()}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': 'https://fitbmi.app',
    'X-Title': process.env.EXPO_PUBLIC_OPENROUTER_APP_NAME ?? 'FitBMI',
  };
}

function ensureKey(): void {
  if (!hasApiKey()) {
    throw new OpenRouterError(
      'No OpenRouter API key. Set EXPO_PUBLIC_OPENROUTER_API_KEY in your .env file.',
    );
  }
}

/** Decode a Uint8Array chunk to text, preferring the global TextDecoder. */
const decoder =
  typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8') : null;
function decodeChunk(value: Uint8Array): string {
  if (decoder) return decoder.decode(value, { stream: true });
  // ASCII fallback (SSE control data is ASCII).
  let out = '';
  for (let i = 0; i < value.length; i += 1) out += String.fromCharCode(value[i]!);
  return out;
}

/** Non-streaming completion with model fallback. */
export async function chatCompletion(
  messages: ChatMessage[],
  opts: CompletionOptions = {},
): Promise<CompletionResult> {
  ensureKey();
  const models = opts.models ?? MODEL_FALLBACK;
  let lastError: unknown;

  for (const model of models) {
    try {
      const res = await expoFetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: headers(),
        signal: opts.signal,
        body: JSON.stringify({
          model,
          messages,
          temperature: opts.temperature ?? 0.7,
          max_tokens: opts.maxTokens,
        }),
      });
      if (!res.ok) {
        throw new OpenRouterError(
          `OpenRouter ${model} failed: ${res.status}`,
          res.status,
        );
      }
      const json = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const text = json.choices?.[0]?.message?.content ?? '';
      if (!text) throw new OpenRouterError(`Empty response from ${model}`);
      return { text, model };
    } catch (err) {
      lastError = err;
      // Try the next model in the fallback chain.
    }
  }
  throw lastError instanceof Error
    ? lastError
    : new OpenRouterError('All models failed');
}

/**
 * Streaming completion with model fallback. Invokes onToken with each delta.
 * Returns the full text and the model used once the stream finishes.
 */
export async function streamChatCompletion(
  messages: ChatMessage[],
  onToken: (delta: string) => void,
  opts: CompletionOptions = {},
): Promise<CompletionResult> {
  ensureKey();
  const models = opts.models ?? MODEL_FALLBACK;
  let lastError: unknown;

  for (const model of models) {
    try {
      const res = await expoFetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: headers(),
        signal: opts.signal,
        body: JSON.stringify({
          model,
          messages,
          temperature: opts.temperature ?? 0.7,
          max_tokens: opts.maxTokens,
          stream: true,
        }),
      });
      if (!res.ok || !res.body) {
        throw new OpenRouterError(
          `OpenRouter ${model} failed: ${res.status}`,
          res.status,
        );
      }

      const reader = res.body.getReader();
      let full = '';
      let buffer = '';
      // Read SSE stream.
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decodeChunk(value);
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;
          const data = trimmed.slice(5).trim();
          if (data === '[DONE]') continue;
          try {
            const json = JSON.parse(data) as {
              choices?: { delta?: { content?: string } }[];
            };
            const delta = json.choices?.[0]?.delta?.content;
            if (delta) {
              full += delta;
              onToken(delta);
            }
          } catch {
            // Ignore keep-alive / partial JSON lines.
          }
        }
      }
      if (!full) throw new OpenRouterError(`Empty stream from ${model}`);
      return { text: full, model };
    } catch (err) {
      lastError = err;
      // Fall back to next model.
    }
  }
  throw lastError instanceof Error
    ? lastError
    : new OpenRouterError('All models failed');
}
