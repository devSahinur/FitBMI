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
- **Health Tracker** — weight, body fat %, water, calories, sleep, and
  **live step tracking** (device pedometer via `expo-sensors`); progress rings,
  weekly/monthly SVG trend charts, stats cards, streaks, and an **expandable
  speed-dial FAB** for quick logging.
- **Profile** — avatar, details, units, theme mode + variant, **language picker
  (7 languages)**, notification toggles, premium flags, achievements, data
  backup, legal screens.
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

## 🏗️ Publishing to Google Play (step by step)

Prerequisites: a paid Google Play Console account, an Expo account, and the
EAS CLI (`npm i -g eas-cli`).

### 1. Configure the app

In `app.json` (`expo.android`):

- `package` — set a unique application id you own (e.g. `com.yourname.fitbmi`).
- `versionCode` — integer, increment every upload (EAS can auto-increment).
- `version` — user-facing version (e.g. `1.0.0`).
- Adaptive icon + monochrome (themed) icon and splash are already configured.
- Declared permissions: `ACTIVITY_RECOGNITION` (steps), `POST_NOTIFICATIONS`,
  `VIBRATE`, `RECEIVE_BOOT_COMPLETED`.

> If you don't use live step tracking, remove `expo-sensors` and the
> `ACTIVITY_RECOGNITION` permission to simplify the Data Safety form.

### 2. Add your production AI key

`EXPO_PUBLIC_*` vars are inlined into the JS bundle at build time. For a real
release set the key as an EAS build env var (don't ship a personal key):

```bash
eas env:create --name EXPO_PUBLIC_OPENROUTER_API_KEY --value "sk-or-..." \
  --environment production
```

(Or omit it — AI features degrade gracefully and the rest of the app works.)

### 3. Build the release bundle (.aab)

```bash
eas login
eas build:configure          # first time only
eas build --profile production --platform android
```

This produces an Android App Bundle (`.aab`). EAS manages the upload signing
key automatically (Play App Signing).

### 4. Create the Play Console listing

In [Play Console](https://play.google.com/console) → **Create app**, then fill:

- **Store listing**: app name (FitBMI), short + full description, app icon
  (512×512), feature graphic (1024×500), and **2–8 phone screenshots**
  (take them from Expo Go / an emulator).
- **App content**: Privacy Policy URL (host the text from `/privacy` publicly —
  e.g. a GitHub Pages / Notion page), content rating questionnaire, target
  audience, ads declaration (**No ads**), and the **Data Safety** form.
- **Health disclaimer**: the in-app disclaimer ("not medical advice") also
  appears on the Privacy/Terms screens — keep it in your listing description.

### 5. Data Safety form — what to declare

- **Data collected/shared with us:** none (no backend).
- **Stored on device:** profile + health metrics (local only).
- **Shared with third parties:** when AI features are used, the request text +
  basic profile context is sent to **OpenRouter** for processing (declare as
  "Health & fitness" / "App activity", purpose: app functionality, not for ads).
- **Permissions:** Physical activity (steps), Notifications.

### 6. Submit

```bash
# Optional: let EAS upload to an internal track as a draft
eas submit --profile production --platform android
```

Then in Play Console: create a release (Internal testing → Closed → Production),
attach the build, complete the content declarations, and roll out.

> Tip: start with the **Internal testing** track to validate the build on real
> devices before promoting to Production.

## 🛍️ Store Listing (copy-paste)

> Character limits: **Title** ≤ 30, **Short description** ≤ 80, **Full
> description** ≤ 4000. Category: **Health & Fitness**. Ads: **No**.

**Title**

```
FitBMI – BMI & AI Coach
```

**Short description**

```
BMI calculator, AI coach, step, water & sleep tracker. Private & offline.
```

**Full description**

```
FitBMI is a beautiful, privacy-first BMI calculator and health tracker with a built-in AI health coach. Calculate your BMI, build healthy habits, and get personalised guidance — all while your data stays on your device.

★ BMI CALCULATOR
• Metric & imperial units
• Animated gauge with color-coded categories
• Healthy weight range and smart recommendations

★ AI HEALTH COACH
• Chat for fitness, nutrition, water, sleep & calorie advice
• Daily AI insights on your home screen
• Generate meal plans, workouts, recipes, goal plans and weekly reports
(AI responses are informational only and not medical advice.)

★ HEALTH TRACKER
• Live step tracking with your device’s pedometer
• Log weight, body fat, water, sleep and calories
• Weekly & monthly charts and statistics

★ STAY MOTIVATED
• Streaks, XP, levels, coins and a daily reward wheel
• Achievements and daily challenges
• Friendly local reminders

★ BEAUTIFUL & PRIVATE
• Light, Dark and AMOLED modes + 6 theme styles
• 7 languages (English, Español, Français, Deutsch, العربية, हिन्दी, বাংলা)
• Works offline — no account required, your data stays on your device
• Export your history as CSV or a report

Start your journey to a healthier you with FitBMI today!

Disclaimer: This app is intended for general fitness and wellness purposes and does not provide medical advice. Always consult a qualified healthcare professional for medical decisions.
```

**Suggested tags / search terms:** BMI calculator, body mass index, weight
tracker, AI fitness coach, step counter, water tracker, sleep tracker, health
diary.

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
