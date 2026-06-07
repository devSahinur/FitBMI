module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    // Reanimated 4 uses the react-native-worklets babel plugin, which is
    // injected by `nativewind/babel`. No separate reanimated plugin needed.
  };
};
