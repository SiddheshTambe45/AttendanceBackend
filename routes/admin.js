import express from 'express';
import { verifyJWT } from '../middleware/authenticate.js'
import { addStudents, getBranchDivisionSemesterData, getDivisionData, saveDivisionData } from '../controllers/adminController.js';

const router = express.Router();

router.get('/getDivisionData',getDivisionData);
router.post('/saveDivisionData',saveDivisionData);

router.get('/getBranchDivisionSemesterData',getBranchDivisionSemesterData);
router.post('/addStudents',addStudents);


export default router;