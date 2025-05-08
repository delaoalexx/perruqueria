module.exports = function (api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'],
      plugins: [

        // Para leer variables del archivo .env
        ['module:react-native-dotenv', {
          moduleName: '@env',
          path: '.env',
          blocklist: null,
          allowlist: null,
          safe: false,
          allowUndefined: true
        }],
        
        // Para usar imports más limpios como '@components/...'
        ['module-resolver', {
          root: ['./'],
          alias: {
            '@assets': './assets',
            '@components': './components',
            '@screens': './screens',
            '@firebase': './firebase',
            '@utils': './utils',
            '@contexts': './contexts'
          },
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
        }]
      ]
    };
  };
  