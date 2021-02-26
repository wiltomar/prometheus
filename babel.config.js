module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: [
    [
      'module-resolver', {
        alias: {
          '@modules': './src/modules',
          '@core': './src/core',
          '@shared': './src/shared',
          '@infra': './src/infra',
          '@config': './src/config',
        },
      },
    ],
    [
      require('@babel/plugin-proposal-decorators').default,
      {
         legacy: true
      }
   ]
  ],
  ignore: [
    '**/*.spec.ts',
  ],
  
};
