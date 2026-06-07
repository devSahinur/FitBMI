/* eslint-disable no-undef */
// Use the official in-memory AsyncStorage mock for tests.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
