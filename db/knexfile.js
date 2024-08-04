import knex from 'knex';

const config = {
  client: 'mysql2',
  connection: {
    host: 'localhost',
    user: 'mysqlUser', //newuser //new_user
    password: 'secure_password', //newpassword //new_password
    database: 'attendance',  //newdatabase //college 
    timezone: 'Z' //utc
  }
};

const db = knex(config);

export default db;