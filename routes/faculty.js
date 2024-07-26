import express from 'express';
import {getFacultyTeachingData,getParticularData,updateAttendanceData,getAllAttendanceData} from '../controllers/facultyController.js'

const router = express.Router();

// router.get('/session/updates',getSessionUpdates);
router.get('/getFacultyTeachingData',getFacultyTeachingData); //
router.get('/getParticularData',getParticularData); //
// router.get('/getLectureDates',fetchLectureDates);
// router.get('/getAttendanceData',getAttendanceData);
router.put('/updateAttendanceData',updateAttendanceData); // 
router.get('/getAllAttendanceData',getAllAttendanceData); //

export default router;