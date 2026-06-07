# FitBMI — BMI Calculator & Health Tracker

A modern, production-quality React Native (Expo) health app: BMI calculation,
daily health tracking, an AI health coach, gamification, and a polished
glassmorphism design with light / dark / AMOLED themes. Local-first (no backend)
and **runs in Expo Go (SDK 54)** — no custom dev client required.

> ⚕️ **Disclaimer:** This app is for general fitness and wellness purposes only
> and does not provide medical advice. AI responses are informational only.

---

## ✨ Features

- **Onboarding** — 7 animated slides that **collect the user's profile** (name,
  gender, age, height, weight, target) and request notification permission.
  Shown once on first launch (persisted flag).
- **Home** — greeting, animated daily summary (weight, BMI, target, calories,
  water, sleep, steps), streak, daily AI insights, motivational quote, and
  pull-to-refresh.
- **BMI Calculator** — metric/imperial, animated gauge + progress circle,
  classification colors, healthy range, recommendation cards, confetti for a
  healthy result.
- **AI Studio** — Health Coach chat + Meal Plan, Workout, Recipe, Goal Planner
  and Weekly Report generators (see below).
- **Health Tracker** — weight, body fat %, water, calories, sleep, steps;
  progress rings, weekly/monthly SVG trend charts, stats cards, streaks, and an
  **expandable speed-dial FAB** for quick logging.
- **Profile** — avatar, details, units, theme mode + variant, language,
  notification toggles, premium flags, achievements, data backup, legal screens.
- **Achievements & Gamification** — XP, levels, coins, daily check-ins, reward
  wheel, daily challenges, animated badges + confetti.
- **Notifications** — local daily reminders (water, weight, sleep, motivation).
- **Auth UI (no backend)** — Login, Register (avatar picker), Forgot password,
  OTP, social buttons — UI only, ready to wire to a provider.
- **Premium screen** — plans, feature comparison, animated gradient, restore.

> **History tab** and the Profile **"More"** section (Account, Rewards,
> Dashboard, Premium navigation) are intentionally **disabled / "Coming soon"**
> in this build — the code exists and can be re-enabled for a later release.

## 🧱 Tech Stack

React Native 0.81 · Expo SDK 54 · React 19 · TypeScript (strict) · Expo Router ·
NativeWind · Reanimated 4 + Worklets · Moti · React Hook Form · Zustand ·
React Query · AsyncStorage · React Native SVG (charts) · @gorhom/bottom-sheet ·
i18next / react-i18next · expo-localization · Google Fonts (Poppins + Inter) ·
Expo Haptics / Blur / Linear Gradient / Notifications / Sharing / File System ·
Gesture Handler · FlashList · Lucide icons.

> Storage uses **AsyncStorage** and charts use **react-native-svg** (both
> bundled in Expo Go). For a higher-performance production build you can swap
> `services/storage.service.ts` to `react-native-mmkv` and the charts to
> Victory Native XL + Skia — only those files change.

## 📁 Folder Structure

```
src/
  app/                 # Expo Router routes (file-based navigation)
    (tabs)/            # Bottom tabs: index (Home), calculator, ai, tracker, profile
    ai/                # coach, meal, workout, recipe, goals, report
    auth/              # login, register, forgot, otp (UI only)
    onboarding.tsx     # First-run onboarding + profile capture
    premium.tsx        # Subscription screen (modal)
    rewards.tsx        # Gamification (gated "coming soon")
    dashboard.tsx      # Health dashboard (gated "coming soon")
    privacy / terms / about
    _layout.tsx        # Providers, fonts, splash, onboarding gate, theme
  components/          # ui/, ai/, auth/, charts/, gamification/, layout/
  screens/             # Screen implementations (imported by routes)
  features/            # ai/ (prompts, types), food-scanner/, community/, bmi/
  hooks/               # useTheme, useHaptics, useBMI, useStreak, useChat,
                       #   useAIContext, useReducedMotion
  store/               # Zustand stores (persisted via AsyncStorage)
  services/            # storage, openrouter, ai, admob, premium, notifications, export
  i18n/                # i18next init + locales (en/es/fr/de/ar/hi/bn)
  constants/           # tokens, thresholds, achievements, quotes
  theme/               # colors, typography, spacing, shadows, variants
  types/               # shared TypeScript types
  utils/               # bmi, units, format, date, stats, csv, id, xp
  assets/              # images, lottie, fonts
e2e/                   # Detox scaffold (requires a native build)
```

## 🤖 AI Features (OpenRouter)

Powered by **OpenRouter** with automatic model fallback — **free models first**,
then low-cost paid fallbacks so the coach keeps working if a free model is
rate-limited:

```
deepseek/deepseek-chat-v3-0324:free
meta-llama/llama-3.3-70b-instruct:free
google/gemini-2.0-flash-exp:free
qwen/qwen-2.5-72b-instruct:free
openai/gpt-4o-mini            (paid fallback)
google/gemini-flash-1.5       (paid fallback)
```

- **AI Health Coach** — streaming chat (SSE via `expo/fetch`), markdown
  rendering, typing animation, avatars, persisted history
  (`services/openrouter.service.ts`, `hooks/useChat.ts`).
- **Daily AI Insights** — motivation/tip/fact/summary cards on Home (cached
  per day with React Query; skeleton loading).
- **Meal Plan · Workout · Recipe · Goal Planner · Weekly Report** generators
  (`services/ai.service.ts`, `features/ai/prompts.ts`) — cached, shareable.
- **Food Scanner** & **Community** are typed, **disabled** architecture modules
  (`features/food-scanner`, `features/community`) for a future release.

> Without an API key the AI screens degrade gracefully and prompt you to add one.

### Set your key

```bash
cp .env.example .env
# then edit .env:
EXPO_PUBLIC_OPENROUTER_API_KEY=sk-or-...   # from https://openrouter.ai/keys
```

`EXPO_PUBLIC_*` vars are inlined at build time — **restart the dev server** after
editing `.env`. `.env` is gitignored; `.env.example` is committed.

## 🎨 Design System

- **Typography** — Poppins (headings) + Inter (body) via `@expo-google-fonts`,
  loaded behind the animated splash (`theme/typography.ts`).
- **Tokens** — primary `#00C897`, secondary `#00A8FF`, accent `#FFB800`,
  success `#00D26A`, warning `#FF9F1C`, error `#FF4D4F`; 24px card radius;
  8/12/16/20/24/32 spacing.
- **Theme modes** — Light / Dark / System.
- **Theme variants (6)** — Glassmorphism, Neumorphism, Dark AMOLED, Green
  Nature, Blue Ocean, Purple Premium (selectable in Profile, compose with
  light/dark).
- **Animations** — Reanimated 4 + Moti; respect the OS **Reduce Motion** setting
  via `hooks/useReducedMotion`. Animated splash, gauge, counters, card
  entrances, confetti, reward wheel, success check, skeleton/shimmer.
- **Bottom sheets** — `@gorhom/bottom-sheet` `BottomSheetModal` rendered through
  a root `BottomSheetModalProvider` (portal — never blocks screen scroll).

## 🌍 Internationalization

`i18next` + `react-i18next` with device-language detection and 7 locales:
English, Spanish, French, German, Arabic, Hindi, Bangla. Switch in Profile →
Language. (Tab labels are wired as the live example; extend keys in
`src/i18n/locales/*`.)

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. (optional) add your OpenRouter key for AI features
cp .env.example .env   # then paste EXPO_PUBLIC_OPENROUTER_API_KEY

# 3. Start the dev server
npm start
# then scan the QR code with Expo Go (SDK 54), or press "a" / "i" / "w"
```

> `--legacy-peer-deps` is used because a few RN libraries declare strict React
> peer ranges. Everything runs in **Expo Go** — no native build needed.

## 📜 Scripts

| Command             | Description              |
| ------------------- | ------------------------ |
| `npm start`         | Start Expo dev server    |
| `npm run android`   | Run on Android           |
| `npm run ios`       | Run on iOS               |
| `npm run web`       | Run on web               |
| `npm test`          | Run Jest unit tests      |
| `npm run lint`      | ESLint                   |
| `npm run format`    | Prettier                 |
| `npm run typecheck` | TypeScript (no emit)     |

## 🧪 Testing

Unit tests (Jest, **44 passing**) cover pure logic — BMI math, unit
conversions, date/streak helpers, CSV, XP/levels, AI prompt builders, the
OpenRouter model-fallback (with `expo/fetch` mocked) — and the history +
gamification stores. AsyncStorage is mocked in `jest.setup.js`.

```bash
npm test
```

**Detox** e2e is scaffolded in `e2e/` + `.detoxrc.js` (requires `expo prebuild`
and a native build — it does not run in Expo Go).

## 🏗️ Building for Google Play

```bash
eas build  --profile production --platform android   # .aab
eas submit --profile production --platform android   # internal track, draft
```

App config (`app.json`):

- `android.package`: `com.fitbmi.app` — change to your own.
- Adaptive icon + monochrome (themed icon) configured.
- Targets the latest Android API via Expo SDK 54.
- Permissions: ACTIVITY_RECOGNITION, POST_NOTIFICATIONS, VIBRATE,
  RECEIVE_BOOT_COMPLETED.

### Play Store checklist

- ✅ Privacy Policy (`/privacy`) — host publicly and link in the Data Safety form.
- ✅ Terms & Conditions (`/terms`) and in-app medical disclaimer.
- ✅ No backend; all data stays on device (declare in Data Safety).
- ✅ Ads disabled by default.

## 💰 Ads & 🔐 Premium

- Ads are abstracted in `services/admob.service.ts` (banner / interstitial /
  rewarded / app-open) and **disabled by default**. To enable:
  `npx expo install react-native-google-mobile-ads`, add the config plugin + IDs
  to `app.json`, implement the no-op methods, and gate on the `removeAds` flag.
- Premium feature flags live in `services/premium.service.ts` +
  `store/premium.store.ts` (remove ads, unlimited history, unlimited AI chats,
  advanced analytics/reports, export PDF, custom themes, weekly reports). Wire
  an IAP provider (RevenueCat / `expo-in-app-purchases`) into
  `PremiumService.restore()` / `setFlags()`.

## ⚡ Performance & ♿ Accessibility

- FlashList for lists, `React.memo`, memoized selectors/derivations, Reanimated
  worklets for 60 FPS, React Query caching for AI calls.
- Reduce-Motion aware animations, large-font support (`maxFontSizeMultiplier`),
  accessibility roles/labels, responsive layouts.

## 📄 License

App code: MIT. Replace placeholder assets and the bundle identifier before
publishing, and ensure every third-party asset you add is licensed for
commercial use (icons: Lucide; fonts: Google Fonts / OFL).
