# Assets

All assets must be **free for commercial use**. Suggested sources:

| Type          | Source                                   | License note                    |
| ------------- | ---------------------------------------- | ------------------------------- |
| Icons         | [Lucide](https://lucide.dev)             | ISC (bundled via npm)           |
| Illustrations | [unDraw](https://undraw.co)              | Free, no attribution required   |
| Lottie        | [LottieFiles](https://lottiefiles.com)   | Check per-file license          |
| Photos        | [Pexels](https://pexels.com), [Freepik](https://freepik.com) | Check per-file license |
| Fonts         | [Google Fonts](https://fonts.google.com) | Open Font License               |

## images/

Generated brand placeholders are included (`icon.png`, `adaptive-icon.png`,
`adaptive-icon-monochrome.png`, `splash.png`, `notification-icon.png`,
`favicon.png`). Replace with final 1024×1024 artwork before release.

## lottie/

Drop `.json` Lottie files here and load them with `lottie-react-native`:

```tsx
import LottieView from 'lottie-react-native';
import confetti from '@/assets/lottie/confetti.json';

<LottieView source={confetti} autoPlay loop={false} />;
```

## fonts/

To use the Inter font family referenced in `tailwind.config.js`, install the
Google Fonts package and load it in the root layout:

```bash
npx expo install @expo-google-fonts/inter expo-font
```

```tsx
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';

const [loaded] = useFonts({
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
});
```

Until then the app falls back to the system font, which looks great too.
