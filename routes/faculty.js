import express from 'express';
import {getFacultyTeachingData, getParticularData, getAllAttendanceData, updateAttendanceData} from '../controllers/facultyController.js'
import { verifyJWT } from '../middleware/authenticate.js'

const router = express.Router();

// router.get('/session/updates',getSessionUpdates);
router.get('/getFacultyTeachingData',verifyJWT,getFacultyTeachingData); //
router.get('/getParticularData',verifyJWT,getParticularData); //
// // router.get('/getLectureDates',fetchLectureDates);
// // router.get('/getAttendanceData',getAttendanceData);
router.put('/updateAttendanceData',verifyJWT,updateAttendanceData); // 
router.get('/getAllAttendanceData',verifyJWT,getAllAttendanceData); //

export default router;