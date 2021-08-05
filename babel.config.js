module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        },
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: [
    'babel-plugin-transform-typescript-metadata',
    [
      'module-resolver', {
        alias: {
          '@modules': __dirname + '/src/modules',
          '@core': __dirname + '/src/core',
          '@shared': __dirname + '/src/shared',
          '@infra': __dirname + '/src/infra',
          '@config': __dirname + '/src/config',
        },
      },
    ],
    [
      require('@babel/plugin-proposal-decorators').default,
      {
         legacy: true
      }
   ],
   [
     require('@babel/plugin-proposal-class-properties').default, 
     { 
       loose: true 
    }
   ]
  ],
  ignore: [
    '**/*.spec.ts',
  ],
};

