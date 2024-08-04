import db from '../db/knexfile.js';



  
  export const fetchAttendanceData = async (req, res) => {
    const { semester, batch, division, branch } = req.query;
    console.log(semester, branch, division, batch);
    
    try {
      // Step 1: Get SEM_IDs and SUBJECTs from sem_info table
      let semInfoQuery;
      if (batch === 'ALL') {
        // If batch is 'ALL', select data for all batches
        semInfoQuery = await db('sem_info')
          .select('SEM_ID', 'SUBJECT_ID', 'BATCH')
          .where({
            SEMESTER: parseInt(semester),
            BRANCH: branch,
            DIVISION: division
          });
      } else {
        // If a specific batch is selected
        semInfoQuery = await db('sem_info')
          .select('SEM_ID', 'SUBJECT_ID')
          .where({
            SEMESTER: parseInt(semester),
            BRANCH: branch,
            DIVISION: division,
            BATCH: batch
          });
      }
  
      if (semInfoQuery.length === 0) {
        return res.status(404).json({ message: 'No records found for the given criteria' });
      }
  
      // Step 2: Get all students for the given criteria from student_info table
      let studentsQuery;
      if (batch === 'ALL') {
        studentsQuery = await db('student_info')
          .select('PRN', 'NAME', 'BATCH')
          .where({
            SEMESTER: parseInt(semester),
            BRANCH: branch,
            DIVISION: division
          });
      } else {
        studentsQuery = await db('student_info')
          .select('PRN', 'NAME')
          .where({
            SEMESTER: parseInt(semester),
            BRANCH: branch,
            DIVISION: division,
            BATCH: batch
          });
      }
  
      // Get subject types
      const subjectTypesQuery = await db('subject')
        .select('SUBJECT_ID', 'TYPE')
        .whereIn('SUBJECT_ID', semInfoQuery.map(row => row.SUBJECT_ID));
  
      const subjectTypes = {};
      subjectTypesQuery.forEach(row => {
        subjectTypes[row.SUBJECT_ID] = row.TYPE;
      });
  
      // Step 3: Prepare the structure to store attendance data
      const attendanceData = [];
  
      // Step 4: Iterate over each student and each subject to fetch attendance
      for (let student of studentsQuery) {
        const studentData = {
          prn: student.PRN,
          name: student.NAME,
          batch: student.BATCH || batch, // Use the student's batch if 'ALL' is selected
          subjects: {}
        };
  
        for (let subject of semInfoQuery) {
          if (student.BATCH && batch === 'ALL' && subject.BATCH !== student.BATCH) {
            // Skip subjects for batches that do not match the student's batch if 'ALL' is selected
            continue;
          }
  
          const attendanceQuery = await db('attendance_table')
            .select('DATE')
            .where('SEM_ID', subject.SEM_ID)
            .andWhere('STUDENTS', 'like', `%${student.PRN}%`); // Correct usage of LIKE
  
          // Prepare attendance array with 1s and 0s based on presence
          const attendanceArray = attendanceQuery.map(() => 1); // Assume all entries are present
  
          // Add subject attendance to studentData
          studentData.subjects[subject.SUBJECT_ID] = {
            type: subjectTypes[subject.SUBJECT_ID],
            attendance: attendanceArray
          };
        }
  
        attendanceData.push(studentData);
      }
  
      // Step 5: Send formatted attendance data as response
      res.status(200).json(attendanceData);
  
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  

  

  export const getCriteria = async (req, res) => {
    try {
      // Step 1: Get all relevant data from sem_info
      const semInfoQuery = await db('sem_info')
        .select('SEMESTER', 'BRANCH', 'DIVISION', 'BATCH')
        .groupBy('SEMESTER', 'BRANCH', 'DIVISION', 'BATCH');
      
      if (semInfoQuery.length > 0) {
        // Initialize data structure for response
        const responseData = {
          semesters: [],
          branches: {},
          divisions: {},
          batches: {}
        };
  
        semInfoQuery.forEach(row => {
          const { SEMESTER, BRANCH, DIVISION, BATCH } = row;
  
          // Semesters
          if (!responseData.semesters.includes(SEMESTER.toString())) {
            responseData.semesters.push(SEMESTER.toString());
          }
  
          // Branches
          if (!responseData.branches[SEMESTER]) {
            responseData.branches[SEMESTER] = [];
          }
          if (!responseData.branches[SEMESTER].includes(BRANCH)) {
            responseData.branches[SEMESTER].push(BRANCH);
          }
  
          // Divisions
          if (!responseData.divisions[SEMESTER]) {
            responseData.divisions[SEMESTER] = {};
          }
          if (!responseData.divisions[SEMESTER][BRANCH]) {
            responseData.divisions[SEMESTER][BRANCH] = [];
          }
          if (!responseData.divisions[SEMESTER][BRANCH].includes(DIVISION)) {
            responseData.divisions[SEMESTER][BRANCH].push(DIVISION);
          }
  
          // Batches
          if (!responseData.batches[SEMESTER]) {
            responseData.batches[SEMESTER] = {};
          }
          if (!responseData.batches[SEMESTER][BRANCH]) {
            responseData.batches[SEMESTER][BRANCH] = {};
          }
          if (!responseData.batches[SEMESTER][BRANCH][DIVISION]) {
            responseData.batches[SEMESTER][BRANCH][DIVISION] = [];
          }
          if (!responseData.batches[SEMESTER][BRANCH][DIVISION].includes(BATCH)) {
            responseData.batches[SEMESTER][BRANCH][DIVISION].push(BATCH);
          }
        });
  
        // Add "ALL" to each batch list
        for (const [semester, branches] of Object.entries(responseData.batches)) {
          for (const [branch, divisions] of Object.entries(branches)) {
            for (const [division, batches] of Object.entries(divisions)) {
              batches.push("ALL"); // Add "ALL" to the batch list
            }
          }
        }
  
        // Step 2: Send the aggregated data as a response
        res.status(200).json(responseData);
      } else {
        // No records found
        res.status(404).json({ message: 'No criteria data found' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  
  
  