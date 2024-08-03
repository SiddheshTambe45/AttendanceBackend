import express from 'express';
import { getCriteria, fetchAttendanceData, getCriteriaFacSub, getSemestersAndDivisions, addStudents, saveTempSemInfo, getSubjectsAndFaculty, getFacultyByDepartment, allocateFacultyToSubject } from '../controllers/hodController.js';

const router = express.Router();

router.get('/getCriteria',getCriteria);
router.get('/fetchAttendanceData',fetchAttendanceData);


router.get('/getCriteriaFacSub',getCriteriaFacSub);
// router.get('/getFacultyDetailsByDepartment',getFacultyDetailsByDepartment);
// router.post('/allocateFacultyAndAddSubjects',allocateFacultyAndAddSubjects);
router.get('/getSubjectsAndFaculty',getSubjectsAndFaculty);
router.get('/getFacultyByDepartment',getFacultyByDepartment);
router.post('/allocateFacultyToSubject',allocateFacultyToSubject);

router.get('/getSemestersAndDivisions',getSemestersAndDivisions);
router.post('/addStudents',addStudents);

router.post('/saveTempSemInfo',saveTempSemInfo);

export default router;