const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable WebAssembly for expo-sqlite on the web
config.resolver.assetExts.push('wasm');

module.exports = config;
