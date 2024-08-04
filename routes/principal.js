import express from 'express';
import { fetchAttendanceData, getCriteria } from '../controllers/principalController.js';
import { verifyJWT } from '../middleware/authenticate.js'


const router = express.Router();

router.get('/getCriteria',verifyJWT,getCriteria);
router.get('/fetchAttendanceData',verifyJWT,fetchAttendanceData);


export default router;