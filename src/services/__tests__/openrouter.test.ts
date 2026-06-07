import { fetch as expoFetch } from 'expo/fetch';

jest.mock('expo/fetch', () => ({ fetch: jest.fn() }));

const mockFetch = expoFetch as unknown as jest.Mock;

function okJson(content: string) {
  return {
    ok: true,
    status: 200,
    json: async () => ({ choices: [{ message: { content } }] }),
  };
}

function fail(status: number) {
  return { ok: false, status, json: async () => ({}) };
}

describe('openrouter service', () => {
  const OLD_ENV = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY;

  beforeEach(() => {
    mockFetch.mockReset();
    process.env.EXPO_PUBLIC_OPENROUTER_API_KEY = 'test-key';
  });

  afterAll(() => {
    process.env.EXPO_PUBLIC_OPENROUTER_API_KEY = OLD_ENV;
  });

  it('hasApiKey reflects the env var', () => {
    const { hasApiKey } = require('../openrouter.service');
    expect(hasApiKey()).toBe(true);
    process.env.EXPO_PUBLIC_OPENROUTER_API_KEY = '';
    expect(hasApiKey()).toBe(false);
  });

  it('falls back to the next model when the first fails', async () => {
    const { chatCompletion, MODEL_FALLBACK } = require('../openrouter.service');
    mockFetch
      .mockResolvedValueOnce(fail(500)) // model 1 fails
      .mockResolvedValueOnce(okJson('hello')); // model 2 succeeds

    const res = await chatCompletion([{ role: 'user', content: 'hi' }]);
    expect(res.text).toBe('hello');
    expect(res.model).toBe(MODEL_FALLBACK[1]);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('throws when all models fail', async () => {
    const { chatCompletion } = require('../openrouter.service');
    mockFetch.mockResolvedValue(fail(500));
    await expect(
      chatCompletion([{ role: 'user', content: 'hi' }]),
    ).rejects.toBeTruthy();
  });

  it('throws without an API key', async () => {
    process.env.EXPO_PUBLIC_OPENROUTER_API_KEY = '';
    const { chatCompletion } = require('../openrouter.service');
    await expect(
      chatCompletion([{ role: 'user', content: 'hi' }]),
    ).rejects.toThrow(/key/i);
  });
});
