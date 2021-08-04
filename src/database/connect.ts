/* eslint-disable no-console */
import { createConnection } from 'typeorm';

createConnection(
).then(conn => {
  console.log('🎲 - Successfully connected with database');
}).catch(err => {
  console.log('🎲 - Error during connection with the database.');
  console.error(err);
})
