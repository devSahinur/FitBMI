# Contributing to FitBMI

Thanks for your interest in improving FitBMI! Contributions of all kinds are
welcome — bug fixes, features, docs, translations and design.

## Getting started

```bash
git clone https://github.com/devSahinur/FitBMI.git
cd FitBMI
npm install --legacy-peer-deps
npm start          # open in Expo Go (SDK 54)
```

## Before you open a PR

Please make sure these all pass:

```bash
npm run typecheck   # strict TypeScript, no errors
npm test            # Jest unit tests
npm run lint        # ESLint
```

- Keep TypeScript **strict** — no `any` unless truly necessary.
- Match the existing style (Prettier runs via `npm run format`).
- Add/adjust unit tests for logic in `src/utils`, `src/store`, `src/features`.
- Keep components small, memoized, and reusable (`src/components`).

## Project conventions

- **State:** Zustand stores in `src/store` (persisted via AsyncStorage).
- **Styling:** theme tokens from `src/theme` + `useTheme()`; respect light/dark
  and reduced-motion.
- **Screens** live in `src/screens` and are wired through `src/app` (Expo Router).
- **AI** goes through `src/services/openrouter.service.ts` + `src/features/ai`.

## Adding a translation

Copy `src/i18n/locales/en.json` to a new `<lang>.json`, translate the values,
and register it in `src/i18n/index.ts`. Add the language to
`SUPPORTED_LANGUAGES` in `src/constants`.

## Reporting bugs

Open an issue with steps to reproduce, expected vs actual behaviour, your
platform (Expo Go / dev build, iOS / Android), and screenshots if relevant.

## Code of conduct

Be respectful and constructive. By contributing you agree your work is licensed
under the project's [MIT License](./LICENSE).
