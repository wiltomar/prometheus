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
          '@modules': __dirname + '/modules',
          '@core': __dirname + '/core',
          '@shared': __dirname + '/shared',
          '@infra': __dirname + '/infra',
          '@config': __dirname + '/config',
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

