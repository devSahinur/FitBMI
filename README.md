# FitBMI — BMI Calculator & Health Tracker

A modern, production-ready React Native (Expo) app for calculating BMI and
tracking daily health metrics. Glassmorphism UI, dark mode, smooth Reanimated /
Moti animations, local-first storage (MMKV), and charts powered by Victory
Native XL + Skia.

> ⚕️ **Disclaimer:** This app is intended for general fitness and wellness
> purposes and does not provide medical advice.

---

## ✨ Features

- **Home** — greeting, animated daily summary (weight, BMI, target, calories,
  water, sleep, steps), streak, and a daily motivational quote.
- **BMI Calculator** — metric/imperial, animated gauge + progress circle,
  classification colors, healthy range, and recommendation cards.
- **History** — search, filter by category, delete, export CSV, share results
  (FlashList for performance).
- **Health Tracker** — weight, body fat %, water, calories, sleep, steps;
  progress rings, weekly & monthly trend charts, statistics cards, streaks; log
  via an animated bottom sheet.
- **Profile** — avatar, details, unit/theme/notification settings, achievements,
  premium flags, data backup, and legal screens.
- **Achievements** — 7-day streak, 30-day streak, healthy BMI, weight goal,
  hydration goal, with animated badges + confetti.
- **Notifications** — local daily reminders (water, weight, sleep, motivation).
- **Premium architecture** — feature flags (remove ads, unlimited history,
  advanced analytics, custom themes, weekly reports) ready for IAP.
- **AdMob architecture** — fully abstracted in `services/admob.service.ts`,
  **disabled by default**.

## 🧱 Tech Stack

React Native 0.81 · Expo SDK 54 · React 19 · TypeScript (strict) · Expo Router ·
NativeWind · Reanimated 4 · Moti · React Hook Form · Zustand · React Query ·
AsyncStorage · React Native SVG (charts) · Expo Haptics / Blur / Linear Gradient
/ Notifications / Sharing · Gesture Handler · FlashList · Lucide icons.

> **Runs in Expo Go (SDK 54).** Storage uses AsyncStorage and charts use
> react-native-svg, both bundled in Expo Go — no custom dev client required.
> To switch to higher-performance native storage/charts for a production build,
> swap `services/storage.service.ts` to react-native-mmkv and `components/charts`
> to Victory Native XL + Skia.

## 📁 Folder Structure

```
src/
  app/            # Expo Router routes (file-based navigation)
    (tabs)/       # Bottom tab navigator: Home, Calculator, History, Tracker, Profile
    privacy.tsx   # Modal: Privacy Policy
    terms.tsx     # Modal: Terms & Conditions
    about.tsx     # Modal: About
    _layout.tsx   # Root layout: providers, splash, theme
  components/      # Reusable UI (ui/, charts/, layout/)
  screens/         # Screen implementations (imported by routes)
  features/        # Feature logic (e.g. bmi/recommendations)
  hooks/           # useTheme, useHaptics, useBMI, useStreak
  store/           # Zustand stores (persisted via MMKV)
  services/        # storage, admob, premium, notifications, export
  constants/       # tokens, thresholds, achievements, quotes
  theme/           # colors, spacing, radius, shadows, light/dark themes
  types/           # shared TypeScript types
  utils/           # bmi, units, format, date, stats, csv, id
  assets/          # images, lottie, fonts
```

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Start the dev server
npm start
# then scan the QR code with Expo Go (SDK 54), or press "a" / "i" / "w"
```

> Everything runs in **Expo Go** — just scan the QR code. No native build needed.

### Fresh install from scratch (Expo CLI)

```bash
npx create-expo-app@latest fitbmi --template blank-typescript
cd fitbmi

# Core
npx expo install expo-router expo-linking expo-constants expo-status-bar \
  expo-system-ui expo-splash-screen react-native-safe-area-context \
  react-native-screens react-native-gesture-handler react-native-reanimated

# UI & state
npx expo install nativewind tailwindcss react-native-svg expo-blur \
  expo-linear-gradient expo-haptics
npm install moti zustand @tanstack/react-query react-hook-form \
  lucide-react-native @gorhom/bottom-sheet react-native-mmkv

# Charts (Skia)
npx expo install @shopify/react-native-skia victory-native @shopify/flash-list

# Device features
npx expo install expo-notifications expo-sharing expo-file-system expo-font
```

## 📜 Scripts

| Command             | Description                       |
| ------------------- | --------------------------------- |
| `npm start`         | Start Expo dev server             |
| `npm run android`   | Run on Android                    |
| `npm run ios`       | Run on iOS                        |
| `npm run web`       | Run on web                        |
| `npm test`          | Run Jest unit tests               |
| `npm run lint`      | ESLint                            |
| `npm run format`    | Prettier                          |
| `npm run typecheck` | TypeScript (no emit)              |

## 🧪 Testing

Pure logic (BMI math, unit conversions, date/streak helpers, CSV) and the
history store are covered with Jest. MMKV is mocked in `jest.setup.js`.

```bash
npm test
```

## 🏗️ Building for Google Play

```bash
# Production app bundle (.aab)
eas build --profile production --platform android

# Submit to Play Console (internal track, draft)
eas submit --profile production --platform android
```

App config (`app.json`):

- `android.package`: `com.fitbmi.app` — change to your own.
- Adaptive icon + monochrome (themed icon) configured.
- Targets the latest Android API via Expo SDK 52.
- Permissions: ACTIVITY_RECOGNITION, POST_NOTIFICATIONS, VIBRATE,
  RECEIVE_BOOT_COMPLETED.

### Play Store checklist

- ✅ Privacy Policy screen (`/privacy`) — host the text publicly and link it in
  the Play Console Data Safety form.
- ✅ Terms & Conditions screen (`/terms`).
- ✅ Medical disclaimer shown in-app and in legal docs.
- ✅ No backend; all data stays on device (declare in Data Safety).
- ✅ Ads disabled by default.

## 💰 Enabling Ads (optional)

Ads are abstracted in `services/admob.service.ts` and off by default. To enable:

```bash
npx expo install react-native-google-mobile-ads
```

Add the config plugin + app IDs to `app.json`, replace the no-op methods with
SDK calls, and gate display behind the premium `removeAds` flag.

## 🔐 Premium / Subscriptions

Feature flags live in `services/premium.service.ts` and the reactive
`store/premium.store.ts`. Wire your IAP provider (RevenueCat or
`expo-in-app-purchases`) into `PremiumService.restore()` / `setFlags()`.

## ⚡ Performance

- FlashList for long lists, `React.memo` across components, memoized selectors
  and computations, Reanimated worklets for 60 FPS animations, and lazy
  Skia-backed charts.

## 📄 License

App code: MIT. Replace placeholder assets and bundle identifiers before
publishing. Ensure every third-party asset you add is licensed for commercial
use.
