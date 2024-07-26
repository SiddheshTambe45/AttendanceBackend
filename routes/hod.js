import express from 'express';
import { getCriteria, fetchAttendanceData, getCriteriaFacSub, getSubjectsAndFaculty, updateSubjects } from '../controllers/hodController.js';

const router = express.Router();

router.get('/getCriteria',getCriteria);
router.get('/fetchAttendanceData',fetchAttendanceData);
router.get('/getCriteriaFacSub',getCriteriaFacSub);
router.get('/getSubjectsAndFaculty',getSubjectsAndFaculty);
router.post('/updateSubjects',updateSubjects);

export default router;