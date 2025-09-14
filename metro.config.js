const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);

// Adicionar suporte a assets da pasta public
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Garantir que arquivos da pasta public sejam incluídos
config.resolver.assetExts.push('png', 'jpg', 'jpeg', 'gif', 'svg', 'json', 'js');

module.exports = config;
