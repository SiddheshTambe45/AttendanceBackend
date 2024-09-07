import dotenv from 'dotenv';

// Ensure this is the correct relative path to your .env file
dotenv.config({ path: './.env' }); 


import app from './app.js';



app.listen(process.env.PORT,()=>{
    console.log("SERVER IS RUNNING ON: "+process.env.PORT);
});
