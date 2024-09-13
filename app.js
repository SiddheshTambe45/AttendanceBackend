import express from "express";
import cors from 'cors';
import cookieParser from 'cookie-parser'; // Import cookie-parser
import facultyRouter from './routes/faculty.js';
import hodRouter from './routes/hod.js';
import principalRouter from './routes/principal.js';
import authenticationRouter from './routes/authentication.js';
import adminRouter from './routes/admin.js';

const app = express();
app.use(express.json());
app.use(cookieParser()); // Use cookie-parser middleware

const corsOptions = {
    credentials: true,
    origin: ['http://localhost:3000', 'https://attendance-liard-seven.vercel.app', 'https://neon-cendol-8167b6.netlify.app', 'https://attendance-15bl.onrender.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: [
        'Content-Type', 
        'Authorization', 
        'X-Requested-With', 
        'X-CSRF-Token',
        // 'Access-Control-Allow-Credentials', // Cookies related header
        // 'Access-Control-Allow-Headers'
    ] // Allowed headers
}
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

app.use('/faculty',facultyRouter);
app.use('/hod',hodRouter);
app.use('/principal',principalRouter);
app.use('/authenticate',authenticationRouter)
app.use('/admin',adminRouter);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

export default app;