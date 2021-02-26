import { ConnectionOptions } from 'typeorm';

// Check typeORM documentation for more information.
const config: ConnectionOptions = {
    type: 'mssql',
    host: 'localhost', // localhost
    port: 1433,// 5432
    username: 'sa', // databse login role username
    password: 'Syscon13!', // database login role password
    database: 'Gerencial', // db name
    // host: process.env.SQL_IP, // localhost
    // port: process.env.SQL_PORT,// 5432
    // username: process.env.SQL_USER, // databse login role username
    // password: process.env.SQL_PASSWORD, // database login role password
    // database: process.env.SQL_DATABASE, // db name
    // entities name should be **.entity.ts
    //__dirname + '/models/*{.ts,.js}'
    //'src/models/*.ts'
    //entities: ['src/models/*{.ts,.js}'],
    entities: ['dist/models/*{.ts,.js}'],
    synchronize: false,
    migrationsRun: false,
    logging: false
};

export = config;