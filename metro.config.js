const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Workaround: Zustand 5's ESM build (resolved on web via the `import`
// condition of its exports map) contains `import.meta.env` references that
// Metro doesn't strip and the dev-mode <script defer> tag can't parse.
// On web, route zustand resolution through the `react-native` condition,
// which points to the CJS build (no `import.meta`).
const defaultResolve = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && /^zustand(\/|$)/.test(moduleName)) {
    return context.resolveRequest(
      { ...context, unstable_conditionNames: ['react-native', 'require', 'default'] },
      moduleName,
      platform,
    );
  }
  return defaultResolve
    ? defaultResolve(context, moduleName, platform)
    : context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
