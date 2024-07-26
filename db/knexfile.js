import knex from 'knex';

const config = {
  client: 'mysql2',
  connection: {
    host: 'localhost',
    user: 'new_user1', //newuser //new_user
    password: 'secure_password', //newpassword //new_password
    database: 'newdatabase1',  //newdatabase //college 
    timezone: 'Z' //utc
  }
};

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