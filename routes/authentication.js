import express from 'express';
import { addFaculty, getDepartments, login, refreshTokens  } from '../controllers/authentication.js';


const router = express.Router();

router.get('/signup/getDepartment',getDepartments);
router.post('/signup/addFaculty',addFaculty);

router.post('/login',login)

router.post('/token/refresh', refreshTokens); // Add this route

export default router;