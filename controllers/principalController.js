import db from '../db/knexfile.js';


// export const getCriteria = async (req, res) => {
//     try {
//         console.log('first')
//       // Step 1: Get all relevant data from sem_info without filtering by branch
//       const semInfoQuery = await db('sem_info')
//         .select('SEMESTER', 'BRANCH', 'DIVISION', 'BATCH', 'SUB_ID');
      
//       if (semInfoQuery.length > 0) {
//         // Step 2: Aggregate the results into arrays
//         const aggregatedData = {
//           semester: [],
//           branch: [],
//           division: [],
//           batch: [],
//           subject: [],
//         };
  
//         semInfoQuery.forEach(row => {
//           if (!aggregatedData.semester.includes(row.SEMESTER)) {
//             aggregatedData.semester.push(row.SEMESTER);
//           }
//           if (!aggregatedData.branch.includes(row.BRANCH)) {
//             aggregatedData.branch.push(row.BRANCH);
//           }
//           if (!aggregatedData.division.includes(row.DIVISION)) {
//             aggregatedData.division.push(row.DIVISION);
//           }
//           if (!aggregatedData.batch.includes(row.BATCH)) {
//             aggregatedData.batch.push(row.BATCH);
//           }
//           if (!aggregatedData.subject.includes(row.SUB_ID)) {
//             aggregatedData.subject.push(row.SUB_ID);
//           }
//         });
  
//         // Step 3: Send the aggregated data as a response
//         res.status(200).json(aggregatedData);
//       } else {
//         // No records found
//         res.status(404).json({ message: 'No criteria data found' });
//       }
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   };
  
/*
export const getCriteria = async (req, res) => {
  try {
    // Step 1: Get all relevant data from sem_info without filtering by branch
    const semInfoQuery = await db('sem_info')
      .select('SEMESTER', 'BRANCH', 'DIVISION', 'BATCH', 'SUB_ID');
    
    if (semInfoQuery.length > 0) {
      // Initialize data structure for response
      const aggregatedData = {};

      // Iterate over the data and aggregate it
      semInfoQuery.forEach(row => {
        if (!aggregatedData[row.SEMESTER]) {
          aggregatedData[row.SEMESTER] = {};
        }
        if (!aggregatedData[row.SEMESTER][row.BRANCH]) {
          aggregatedData[row.SEMESTER][row.BRANCH] = {
            batch: [],
            division: [],
            subject: [],
          };
        }
        if (!aggregatedData[row.SEMESTER][row.BRANCH].batch.includes(row.BATCH)) {
          aggregatedData[row.SEMESTER][row.BRANCH].batch.push(row.BATCH);
        }
        if (!aggregatedData[row.SEMESTER][row.BRANCH].division.includes(row.DIVISION)) {
          aggregatedData[row.SEMESTER][row.BRANCH].division.push(row.DIVISION);
        }
        if (!aggregatedData[row.SEMESTER][row.BRANCH].subject.includes(row.SUB_ID)) {
          aggregatedData[row.SEMESTER][row.BRANCH].subject.push(row.SUB_ID);
        }
      });

      // Format response data to match frontend requirements
      const responseData = [];
      for (const [semester, branches] of Object.entries(aggregatedData)) {
        for (const [branch, criteria] of Object.entries(branches)) {
          responseData.push({
            semester,
            branch,
            batch: criteria.batch,
            division: criteria.division,
          });
        }
      }

      // Step 3: Send the aggregated data as a response
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
*/

/*
export const fetchAttendanceData = async (req, res) => {
    const { semester, batch, division, branch } = req.query;
    console.log(semester, branch, division, batch);
    try {
      // Step 1: Get SEM_IDs and SUBJECTs from sem_info table
      const semInfoQuery = await db('sem_info')
        .select('SEM_ID', 'SUBJECT_ID')
        .where({
          SEMESTER: parseInt(semester),
          BRANCH: branch,
          DIVISION: division, //make divison
          BATCH: batch
        });
  
      if (semInfoQuery.length === 0) {
        return res.status(404).json({ message: 'No records found for the given criteria' });
      }
  
      // Step 2: Get all students for the given criteria from student_info table
      const studentsQuery = await db('student_info')
        .select('PRN', 'NAME')
        .where({
          SEMESTER: parseInt(semester),
          BRANCH: branch,
          DIVISION: division,
          BATCH: batch
        });
  
      // Step 3: Prepare the structure to store attendance data
      const attendanceData = [];
  
      // Step 4: Iterate over each student and each subject to fetch attendance
      for (let student of studentsQuery) {
        const studentData = {
          prn: student.PRN,
          name: student.NAME,
          subjects: {}
        };
  
        for (let subject of semInfoQuery) {
          const attendanceQuery = await db('attendance_table')
            .select('DATE')
            .where('SEM_ID', subject.SEM_ID)
            .andWhere('Students', 'like', `%${student.PRN}%`); // Correct usage of LIKE
  
          // Prepare attendance array with 1s and 0s based on presence
          const attendanceArray = attendanceQuery.map(entry => 1); // Assume all entries are present
  
          // Add subject attendance to studentData
          studentData.subjects[subject.SUBJECT_ID] = attendanceArray;
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
*/


  // export const getCriteria = async (req, res) => {
  //   try {
  //     // Step 1: Get all relevant data from sem_info without filtering by branch
  //     const semInfoQuery = await db('sem_info')
  //       .select('SEMESTER', 'BRANCH', 'DIVISION', 'BATCH', 'SUBJECT_ID');
  
  //     if (semInfoQuery.length > 0) {
  //       // Initialize data structure for response
  //       const responseData = {
  //         semesters: [],
  //         branches: {},
  //         divisions: {},
  //         batches: {},
  //         subjects: {}
  //       };
  
  //       // Iterate over the data and populate the response structure
  //       semInfoQuery.forEach(row => {
  //         const semester = row.SEMESTER.toString();
  //         const branch = row.BRANCH;
  //         const division = row.DIVISION;
  //         const batch = row.BATCH;
  //         const subjectId = row.SUBJECT_ID;
  
  //         // Add semester if not already present
  //         if (!responseData.semesters.includes(semester)) {
  //           responseData.semesters.push(semester);
  //         }
  
  //         // Initialize branches
  //         if (!responseData.branches[semester]) {
  //           responseData.branches[semester] = [];
  //         }
  //         if (!responseData.branches[semester].includes(branch)) {
  //           responseData.branches[semester].push(branch);
  //         }
  
  //         // Initialize divisions
  //         if (!responseData.divisions[semester]) {
  //           responseData.divisions[semester] = {};
  //         }
  //         if (!responseData.divisions[semester][branch]) {
  //           responseData.divisions[semester][branch] = [];
  //         }
  //         if (!responseData.divisions[semester][branch].includes(division)) {
  //           responseData.divisions[semester][branch].push(division);
  //         }
  
  //         // Initialize batches
  //         if (!responseData.batches[semester]) {
  //           responseData.batches[semester] = {};
  //         }
  //         if (!responseData.batches[semester][branch]) {
  //           responseData.batches[semester][branch] = {};
  //         }
  //         if (!responseData.batches[semester][branch][division]) {
  //           responseData.batches[semester][branch][division] = [];
  //         }
  //         if (!responseData.batches[semester][branch][division].includes(batch)) {
  //           responseData.batches[semester][branch][division].push(batch);
  //         }
  
  //         // Initialize subjects
  //         if (!responseData.subjects[semester]) {
  //           responseData.subjects[semester] = {};
  //         }
  //         if (!responseData.subjects[semester][branch]) {
  //           responseData.subjects[semester][branch] = {};
  //         }
  //         if (!responseData.subjects[semester][branch][division]) {
  //           responseData.subjects[semester][branch][division] = {};
  //         }
  //         if (!responseData.subjects[semester][branch][division][batch]) {
  //           responseData.subjects[semester][branch][division][batch] = {};
  //         }
  //         responseData.subjects[semester][branch][division][batch][subjectId] = "T"; // Assuming all subjects are theoretical ("T") for simplicity
  //       });
  
  //       // Step 3: Send the aggregated data as a response
  //       res.status(200).json(responseData);
  //     } else {
  //       // No records found
  //       res.status(404).json({ message: 'No criteria data found' });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     res.status(500).json({ message: 'Internal server error' });
  //   }
  // };
  


  // export const fetchAttendanceData = async (req, res) => {
  //   try {
  //     const { semester, branch, division, batch } = req.query;
  
  //     // Build base query to fetch student data
  //     let studentQuery = db('student_info')
  //       .select('PRN', 'NAME', 'SEMESTER', 'BRANCH', 'DIVISION', 'BATCH')
  //       .where('SEMESTER', semester)
  //       .andWhere('BRANCH', branch)
  //       .andWhere('DIVISION', division);
  
  //     // Handle batch filter
  //     if (batch && batch !== 'ALL') {
  //       studentQuery = studentQuery.andWhere('BATCH', batch);
  //     }
  
  //     // Execute student query
  //     const students = await studentQuery;
  
  //     if (students.length === 0) {
  //       return res.status(404).json({ message: 'No student data found' });
  //     }
  
  //     // Extract PRNs from students
  //     const prns = students.map(student => student.PRN);
  
  //     // Get unique dates for the semester
  //     const datesQuery = db('attendance_table')
  //       .select('DATE')
  //       .whereIn('SEM_ID', function() {
  //         this.select('SEM_ID')
  //           .from('sem_info')
  //           .where('SEMESTER', semester)
  //           .andWhere('BRANCH', branch)
  //           .andWhere('DIVISION', division)
  //           .andWhere(function() {
  //             if (batch && batch !== 'ALL') {
  //               this.andWhere('BATCH', batch);
  //             }
  //           });
  //       })
  //       .distinct();
  
  //     const dates = await datesQuery;
  //     const dateList = dates.map(date => date.DATE.toISOString().split('T')[0]); // Format dates as YYYY-MM-DD
  
  //     // Initialize attendance data
  //     const attendanceData = {};
  //     dateList.forEach(date => {
  //       attendanceData[date] = prns.reduce((acc, prn) => {
  //         acc[prn] = 0; // Initialize all as absent
  //         return acc;
  //       }, {});
  //     });
  
  //     // Fetch attendance records
  //     const attendanceRecords = await db('attendance_table')
  //       .select('DATE', 'STUDENTS')
  //       .whereIn('SEM_ID', function() {
  //         this.select('SEM_ID')
  //           .from('sem_info')
  //           .where('SEMESTER', semester)
  //           .andWhere('BRANCH', branch)
  //           .andWhere('DIVISION', division)
  //           .andWhere(function() {
  //             if (batch && batch !== 'ALL') {
  //               this.andWhere('BATCH', batch);
  //             }
  //           });
  //       });
  
  //     // Update attendance data with present statuses
  //     attendanceRecords.forEach(record => {
  //       const studentsInRecord = record.STUDENTS.split(',');
  //       const dateKey = record.DATE.toISOString().split('T')[0];
  //       studentsInRecord.forEach(prn => {
  //         if (attendanceData[dateKey]) {
  //           attendanceData[dateKey][prn] = 1; // Mark as present
  //         }
  //       });
  //     });
  
  //     // Format response data
  //     const responseData = students.map(student => {
  //       const attendanceArray = dateList.map(date => {
  //         return attendanceData[date][student.PRN] || 0; // 0 for absent, 1 for present
  //       });
  
  //       return {
  //         PRN: student.PRN,
  //         NAME: student.NAME,
  //         BATCH: student.BATCH, // Include batch information
  //         ATTENDANCE: attendanceArray
  //       };
  //     });
  
  //     res.status(200).json(responseData);
  //   } catch (error) {
  //     console.log(error);
  //     res.status(500).json({ message: 'Internal server error' });
  //   }
  // };
  

  
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
  
  
  
  