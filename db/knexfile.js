import dotenv from 'dotenv';
dotenv.config();
import knex from 'knex';

// const config = {
//   client: 'mysql2',
//   connection: {
//     host: 'localhost',
//     user: 'mysqlUser', //newuser //new_user
//     password: 'secure_password', //newpassword //new_password
//     database: 'attendance',  //newdatabase //college 
//     timezone: 'Z' //utc
//   }
// };


const config = {
  client: 'mysql2',
  connection: process.env.DB_CONNECTION,
  timezone: 'UTC' // This is a good practice to set the timezone for MySQL connections
};

// const config = {
//   client: 'mysql2',
//   connection: {
//     host: 'localhost',
//     user: 'newUser456', //newuser //new_user
//     password: 'password_secure', //newpassword //new_password
//     database: 'attendanceManagement',  //newdatabase //college 
//     timezone: 'Z' //utc
//   }
// };

// const config = {
//   client: 'mysql2',
//   connection: {
//     host: 'localhost',
//     port: 5001,
//     user: 'root',
//     password: 'admin',
//     database: 'sideeshtambe',
//     connectTimeout: 10000 // Increase timeout to 10 seconds
//   }
// };

const db = knex(config);

export default db;