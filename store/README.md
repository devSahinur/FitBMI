# Play Store Assets

Everything here is for the Google Play Console listing — these files are **not**
bundled into the app. Generated from the FitBMI brand (primary `#00C897`,
secondary `#00A8FF`).

## Assets → Play Console fields

| File | Size | Play Console field | Notes |
| --- | --- | --- | --- |
| `play-icon-512.png` | 512×512 | **App icon** | 32-bit PNG, **no transparency**. |
| `feature-graphic-1024x500.png` | 1024×500 | **Feature graphic** | No transparency. Shown at the top of the listing. |
| `screenshots/01-home.png` | 1080×1920 | **Phone screenshots** | Min 2, max 8. |
| `screenshots/02-bmi.png` | 1080×1920 | Phone screenshots | |
| `screenshots/03-ai-coach.png` | 1080×1920 | Phone screenshots | |
| `screenshots/04-tracker.png` | 1080×1920 | Phone screenshots | |

> ⚠️ The screenshots are **branded placeholders** (marketing mockups). For the
> best listing, replace them with real captures from the running app — see
> "Capture real screenshots" below.

## Text content (copy-paste)

- **Title**, **Short description**, **Full description**, and **search tags**
  are in the root [`README.md`](../README.md) → "🛍️ Store Listing".
- **Privacy Policy**: [`../PRIVACY.md`](../PRIVACY.md) — host publicly, paste URL
  into _App content → Privacy policy_.
- **Terms & Conditions**: [`../TERMS.md`](../TERMS.md) — optional to host.

## Listing metadata

- **Category:** Health & Fitness
- **Contains ads:** No
- **In-app purchases:** Yes (premium is architected; declare if you ship it)
- **Content rating:** complete the questionnaire (Everyone is expected)
- **Data safety:** see root README → "Data Safety form — what to declare"
  (local storage; OpenRouter third-party processing when AI is used; Physical
  Activity + Notifications permissions)

## Capture real screenshots (recommended)

1. Run the app: `npm start` → open in Expo Go or an emulator.
2. Set up nice demo data (profile, a few logged days) so charts/rings look full.
3. Capture portrait screenshots of: Home, BMI result, AI Coach, Tracker, and
   optionally Rewards / Premium.
4. Recommended size **1080×1920** (9:16). Play accepts 320–3840 px on the long
   edge, 16:9 or 9:16.
5. Drop them in `screenshots/` (overwrite the placeholders) and upload.

> Tip: you can keep the headline style from the placeholders by compositing a
> real capture into these frames, or just upload raw captures — both are fine.

## Remaining to-do before you submit

- [ ] Replace `[Your name / company]` + support email in `PRIVACY.md` / `TERMS.md`.
- [ ] Host the Privacy Policy at a public URL (GitHub Pages / Notion) and add it.
- [ ] Set a unique `android.package` in `app.json` (e.g. `com.yourname.fitbmi`).
- [ ] Add your production `EXPO_PUBLIC_OPENROUTER_API_KEY` as an EAS env var
      (or omit — AI degrades gracefully).
- [ ] (Optional) Capture real screenshots to replace the placeholders.
- [ ] `eas build --profile production --platform android` → upload the `.aab`.
