import fs from 'fs';
import { parse } from 'ini';

const iniFile = parse(fs.readFileSync('./src/config/prometheus.ini', 'utf-8'));
module.exports = {
   type: "mssql",
   host: (iniFile.config.environment === 'development') ? iniFile.development.host : iniFile.production.host,
   port: parseInt((iniFile.config.environment === 'development') ? iniFile.development.dbport : iniFile.production.dbport),
   username: (iniFile.config.environment === 'development') ? iniFile.development.dbuser : iniFile.production.dbuser,
   password: (iniFile.config.environment === 'development') ? iniFile.development.dbpassword : iniFile.production.dbpassword,
   database: (iniFile.config.environment === 'development') ? iniFile.development.database : iniFile.production.database,

   options: {
      synchronize: false,
      logging: false,

      encrypt: true,
      enableArithAbort: true,
      trustServerCertificate: true,
      cryptoCredentialsDetails: {
         minVersion: "TLSv1"
      }
   },
   pool: {
      max: 20,
      min: 0,
      idleTimeoutMillis: 30000
   },
   entities: [
     "./src/models/**/*.ts",
     "./src/models/**/*.js",
     './src/models/*{.ts,.js}'
    ],
    migrations: [
     './src/database/migrations/**/*.ts'
    ],
    cli: {
       migrationsDir: "./src/database/migrations"
    },
    extra: {
       driver: "msnodesqlv8"
    }
}
