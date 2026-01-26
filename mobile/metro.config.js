const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// React Navigation 7 uses explicit .js extensions in ESM modules.
// We need to ensure Metro handles these correctly.
config.resolver.sourceExts.push("js", "json", "ts", "tsx");

module.exports = withNativeWind(config, { input: "./global.css" });
