import express from 'express';
import { fetchAttendanceData, getCriteria } from '../controllers/principalController.js';


const router = express.Router();

router.get('/getCriteria',getCriteria);
router.get('/fetchAttendanceData',fetchAttendanceData);


export default router;