module.exports = {
    type: "mssql",
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: false,
    extra: {
       driver: "msnodesqlv8"
    },  
    options: {
       encrypt: true,
       enableArithAbort: true,
       trustedConnection: true,
       trustServerCertificate: true,
       cryptoCredentialsDetails: {
          minVersion: "TLSv1"
        }
    },
    entities: [
       "src/models/**/*.ts",
       "dist/models/**/*.js",
       __dirname + '/models/*{.ts,.js}'
    ],
    migrations: [
       "src/database/migrations/**/*.ts"
    ],
    cli: {
       migrationsDir: "src/database/migrations"
    }
}