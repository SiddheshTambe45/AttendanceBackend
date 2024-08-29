import express from 'express';
import { getCriteria, fetchAttendanceData, getCriteriaFacSub, getSemestersAndDivisions, addStudents, saveTempSemInfo, getSubjectsAndFaculty, getFacultyByDepartment, allocateFacultyToSubject,getFacultyRolesData, updateFacultyRoles } from '../controllers/hodController.js';
import { verifyJWT } from '../middleware/authenticate.js';

const router = express.Router();

router.get('/getCriteria',verifyJWT,getCriteria);
router.get('/fetchAttendanceData',verifyJWT,fetchAttendanceData);


router.get('/getCriteriaFacSub',verifyJWT,getCriteriaFacSub);
// router.get('/getFacultyDetailsByDepartment',getFacultyDetailsByDepartment);
// router.post('/allocateFacultyAndAddSubjects',allocateFacultyAndAddSubjects);
router.get('/getSubjectsAndFaculty',verifyJWT,getSubjectsAndFaculty);
router.get('/getFacultyByDepartment',verifyJWT,getFacultyByDepartment);
router.post('/allocateFacultyToSubject',verifyJWT,allocateFacultyToSubject);

router.get('/getSemestersAndDivisions',getSemestersAndDivisions);
router.post('/addStudents',verifyJWT,addStudents);

// router.post('/saveTempSemInfo',saveTempSemInfo);

router.get('/getFacultyRolesData',verifyJWT,getFacultyRolesData);
router.post('/updateFacultyRoles',verifyJWT,updateFacultyRoles);

export default router;