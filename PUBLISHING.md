# Publishing FitBMI to Google Play

A step-by-step guide to building and shipping the app. Assets live in
[`store/`](./store) and hosted legal pages in [`docs/`](./docs).

## 1. Configure

In `app.json` (`expo.android`):

- `package` — a unique id you own (this repo uses `com.sahinur.fitbmi`).
- `version` — user-facing (e.g. `1.0.0`). Version code is managed remotely by EAS.
- Adaptive icon + monochrome icon and splash are configured.
- Permissions: `ACTIVITY_RECOGNITION` (steps), `POST_NOTIFICATIONS`, `VIBRATE`,
  `RECEIVE_BOOT_COMPLETED`.

> A project [`.npmrc`](./.npmrc) sets `legacy-peer-deps=true` so EAS Build's
> install phase succeeds.

## 2. Production AI key (optional)

`EXPO_PUBLIC_*` vars are inlined at build time. For a release, set the key as an
EAS env var instead of shipping a personal key:

```bash
eas env:create --name EXPO_PUBLIC_OPENROUTER_API_KEY --value "sk-or-..." \
  --environment production
```

(Omit it and AI features degrade gracefully.)

## 3. Build the bundle

```bash
npm i -g eas-cli
eas login
eas init                                              # links the project
eas build --platform android --profile production     # produces a .aab
```

EAS generates the upload keystore in the cloud (Play App Signing).

## 4. Play Console

Create the app, then complete **App content**:

- **App access:** all functionality available without an account.
- **Ads:** No.
- **Content rating:** answer No to all content questions; the only "Yes" is the
  *Online content → AI-generated content* question. Result: Everyone.
- **Target audience:** 13+ (not children).
- **Data safety:** you collect nothing on a server. When AI is used, request
  text + basic profile context (name, age, height, weight, BMI) is **shared
  with OpenRouter** for app functionality — declare Personal info (Name) and
  Health & fitness as *shared*, encrypted in transit, not for ads/tracking.
  Declare the Physical activity + Notifications permissions.
- **Health:** general wellness/BMI app, not a medical device; does **not** use
  Health Connect.
- **Privacy policy URL:** host `docs/` (GitHub Pages → `.../privacy.html`).

## 5. Store listing

Use the assets in `store/` and the copy below.

**Title** (≤30): `FitBMI – BMI & AI Coach`

**Short description** (≤80):
`BMI calculator, AI coach, step, water & sleep tracker. Private & offline.`

**Full description:**

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
• Live step tracking with your device's pedometer
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

- **Category:** Health & Fitness · **Contains ads:** No

### Graphics (in `store/`)

| Asset | Size | Field |
| --- | --- | --- |
| `play-icon-512.png` | 512×512 | App icon |
| `feature-graphic-1024x500.png` | 1024×500 | Feature graphic |
| `screenshots/*.png` | 1080×1920 | Phone screenshots (min 2) |

## 6. Release

Start with **Internal testing** (add yourself as a tester via an email list and
the opt-in link), verify on a device, then promote the same bundle to
**Production**. Or automate uploads with a Play service-account key:

```bash
eas submit --platform android --profile production
```

First-time apps go through Google review (hours–days) before going live.
