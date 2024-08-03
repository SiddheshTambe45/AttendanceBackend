import express from "express";
import cors from 'cors';
import facultyRouter from './routes/faculty.js';
import hodRouter from './routes/hod.js';
import principalRouter from './routes/principal.js';
import authenticationRouter from './routes/authentication.js';

const app = express();
app.use(express.json());

app.use(cors());

app.use('/faculty',facultyRouter);
app.use('/hod',hodRouter);
app.use('/principal',principalRouter);
app.use('/authenticate',authenticationRouter)

app.get('/', (req, res) => {
    res.send('Hello World!');
});

export default app;