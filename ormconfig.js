import fs from 'fs';
import { parse } from 'ini';

const iniFile = parse(fs.readFileSync(__dirname + '/src/config/prometheus.ini', 'utf-8'));
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
      stream: false,
    
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
     __dirname + "/models/**/*.ts",
     __dirname + "/models/**/*.js",
     __dirname + '/models/*{.ts,.js}'
    ],
    migrations: [
     __dirname + '/database/migrations/**/*.ts'
    ],
    cli: {
       migrationsDir: __dirname + "./database/migrations"
    },
    extra: {
       driver: "msnodesqlv8"
    }  
}
