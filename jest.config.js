module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // Detox e2e specs run via e2e/jest.config.js, not the unit runner.
  testPathIgnorePatterns: ['/node_modules/', '/e2e/', '/dist-check/'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|nativewind|moti|react-native-reanimated|@shopify/.*|victory-native|lucide-react-native))',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/utils/**/*.{ts,tsx}',
    'src/store/**/*.{ts,tsx}',
  ],
};
