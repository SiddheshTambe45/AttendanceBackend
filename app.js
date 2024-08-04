import express from "express";
import cors from 'cors';
import cookieParser from 'cookie-parser'; // Import cookie-parser
import facultyRouter from './routes/faculty.js';
import hodRouter from './routes/hod.js';
import principalRouter from './routes/principal.js';
import authenticationRouter from './routes/authentication.js';

const app = express();
app.use(express.json());
app.use(cookieParser()); // Use cookie-parser middleware

const corsOptions = {
    credentials: true,
    origin: ['http://localhost:3000']
}
app.use(cors(corsOptions));

app.use('/faculty',facultyRouter);
app.use('/hod',hodRouter);
app.use('/principal',principalRouter);
app.use('/authenticate',authenticationRouter)

app.get('/', (req, res) => {
    res.send('Hello World!');
});

export default app;