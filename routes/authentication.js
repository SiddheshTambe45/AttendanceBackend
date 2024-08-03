import express from 'express';
import { addFaculty, getDepartments, login } from '../controllers/authentication.js';


const router = express.Router();

router.get('/signup/getDepartment',getDepartments);
router.post('/signup/addFaculty',addFaculty);

router.post('/login',login)

export default router;