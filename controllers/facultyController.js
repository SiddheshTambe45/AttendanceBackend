import db from '../db/knexfile.js';


// export const getSessionUpdates = async (req, res) => {
//     try {
//         const { faculty_id } = req.body;

//         // Step 1: Get all sem_id values for the given faculty_id from the info_table
//         const infoTableQuery = await db('info_table')
//             .select('sem_id')
//             .where({ faculty_id });

//         if (infoTableQuery.length > 0) {
//             const semIds = infoTableQuery.map(row => row.sem_id);

//             // Step 2: Gather all data from pendingUpdates for each sem_id
//             const pendingUpdatesData = [];
//             const relatedInfoData = [];

//             for (const sem_id of semIds) {
//                 const pendingUpdatesQuery = await db('pendingUpdates')
//                     .select()
//                     .where({ sem_id });

//                 if (pendingUpdatesQuery.length > 0) {
//                     pendingUpdatesData.push(...pendingUpdatesQuery);

//                     // Step 3: Retrieve related sem, branch, div, and sub from the info_table for each sem_id found in pendingUpdates
//                     const relatedInfoQuery = await db('info_table')
//                         .select('sem', 'branch', 'div', 'sub')
//                         .where({ sem_id });

//                     if (relatedInfoQuery.length > 0) {
//                         relatedInfoData.push(...relatedInfoQuery);
//                     }
//                 }
//             }

//             if (pendingUpdatesData.length > 0) {
//                 // Do something with pendingUpdatesData and relatedInfoData
//                 console.log(pendingUpdatesData);
//                 console.log(relatedInfoData);
//             } else {
//                 console.log('No pending updates found for the given sem_ids');
//             }
//         } else {
//             console.log('No sem_id found for the given faculty_id');
//         }


//     } catch (error) {
//         console.log(error);
//         res.send(error);
//     }
// }

// export const getSessionEdit = async (req, res) => {
//     try {
//         const specificUsers = await db('semester')
//             .select()
//             .where({ sem, branch });
//     } catch (error) {
//         console.log(error);
//         res.send(error);
//     }
// }


// export const getFacultyTeachingData = async(req,res)=>{
//     try {
//         const { faculty_id } = req.query; // Extract faculty_id from query parameters
//         console.log(faculty_id);
//         // Step 1: Get all relevant data from sem_info for the given faculty_id
//         const infoTableQuery = await db('sem_info')
//             .select('SEMESTER', 'BRANCH', 'DIVISION', 'BATCH', 'SUBJECT_ID')
//             .where({ FACULTY_ID: faculty_id });

//         if (infoTableQuery.length > 0) {
//             // Step 2: Aggregate the results into arrays
//             const aggregatedData = {
//                 semester: [],
//                 branch: [],
//                 division: [],
//                 batch: [],
//                 subject: []
//             };

//             infoTableQuery.forEach(row => {
//                 if (!aggregatedData.semester.includes(row.SEMESTER)) {
//                     aggregatedData.semester.push(row.SEMESTER);
//                 }
//                 if (!aggregatedData.branch.includes(row.BRANCH)) {
//                     aggregatedData.branch.push(row.BRANCH);
//                 }
//                 if (!aggregatedData.division.includes(row.DIVISION)) {
//                     aggregatedData.division.push(row.DIVISION);
//                 }
//                 if (!aggregatedData.batch.includes(row.BATCH)) {
//                     aggregatedData.batch.push(row.BATCH);
//                 }
//                 if (!aggregatedData.subject.includes(row.SUBJECT_ID)) {
//                     aggregatedData.subject.push(row.SUBJECT_ID);
//                 }
//             });

//             // Step 3: Send the aggregated data as a response
//             res.status(200).json(aggregatedData);
//         } else {
//             // No records found for the given faculty_id
//             res.status(404).json({ message: 'No teaching data found for the given faculty ID' });
//         }

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// }

// export const getFacultyTeachingData = async (req, res) => {
//   try {
//     const { faculty_id } = req.query; // Extract faculty_id from query parameters

//     // Step 1: Get all relevant data from sem_info and subject for the given faculty_id
//     const infoTableQuery = await db('sem_info')
//       .select('sem_info.SEMESTER', 'sem_info.BRANCH', 'sem_info.DIVISION', 'sem_info.BATCH', 'sem_info.SUBJECT_ID', 'subject.TYPE')
//       .leftJoin('subject', 'sem_info.SUBJECT_ID', 'subject.SUBJECT_ID')
//       .where({ FACULTY_ID: faculty_id });

//     if (infoTableQuery.length > 0) {
//       // Initialize empty objects to hold the flattened data
//       const semesterBranches = {};
//       const branchDivisions = {};
//       const divisionBatches = {};
//       const subjectDetails = {};

//       // Aggregate the results
//       infoTableQuery.forEach(row => {
//         // Flattening structure
//         if (!semesterBranches[row.SEMESTER]) {
//           semesterBranches[row.SEMESTER] = [];
//         }
//         if (!semesterBranches[row.SEMESTER].includes(row.BRANCH)) {
//           semesterBranches[row.SEMESTER].push(row.BRANCH);
//         }

//         if (!branchDivisions[row.BRANCH]) {
//           branchDivisions[row.BRANCH] = [];
//         }
//         if (!branchDivisions[row.BRANCH].includes(row.DIVISION)) {
//           branchDivisions[row.BRANCH].push(row.DIVISION);
//         }

//         if (!divisionBatches[row.DIVISION]) {
//           divisionBatches[row.DIVISION] = [];
//         }
//         if (!divisionBatches[row.DIVISION].includes(row.BATCH)) {
//           divisionBatches[row.DIVISION].push(row.BATCH);
//         }

//         if (!subjectDetails[row.BRANCH]) {
//           subjectDetails[row.BRANCH] = {};
//         }
//         if (!subjectDetails[row.BRANCH][row.DIVISION]) {
//           subjectDetails[row.BRANCH][row.DIVISION] = {};
//         }
//         if (!subjectDetails[row.BRANCH][row.DIVISION][row.BATCH]) {
//           subjectDetails[row.BRANCH][row.DIVISION][row.BATCH] = {};
//         }
//         if (!subjectDetails[row.BRANCH][row.DIVISION][row.BATCH][row.SUBJECT_ID]) {
//           subjectDetails[row.BRANCH][row.DIVISION][row.BATCH][row.SUBJECT_ID] = row.TYPE;
//         }
//       });

//       // Construct the final flattened structure
//       const flattenedData = {
//         semesters: Object.keys(semesterBranches),
//         branches: semesterBranches,
//         divisions: branchDivisions,
//         batches: divisionBatches,
//         subjects: subjectDetails
//       };

//       // Step 3: Send the flattened data as a response
//       res.status(200).json(flattenedData);
//     } else {
//       // No records found for the given faculty_id
//       res.status(404).json({ message: 'No teaching data found for the given faculty ID' });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

  

// export const getParticularData = async(req,res)=>{
//     try {
//         const { sem, branch, batch, div, sub_id } = req.query; // Extract input parameters from the request body
//         console.log(sem, branch, batch, div, sub_id)

//         // Step 1: Retrieve the list of students in the specified sem, branch, batch, and div
//         const studentsQuery = await db('student_info')
//             .select('PRN', 'NAME') // Adjusted to match your student_info table columns
//             .where({ SEMESTER: sem, BRANCH: branch, BATCH: batch, DIVISION: div });

//         if (studentsQuery.length === 0) {
//             return res.status(404).json({ message: 'No students found for the specified criteria' });
//         }

//         // Step 2: Retrieve the sem_id for the specified criteria from the sem_info table
//         const infoTableQuery = await db('sem_info')
//             .select('SEM_ID')
//             .where({ SEMESTER: sem, BRANCH: branch, BATCH: batch, DIVISION: div, SUBJECT_ID: sub_id });

//         if (infoTableQuery.length === 0) {
//             return res.status(404).json({ message: 'No sem_id found for the specified criteria' });
//         }

//         const semIds = infoTableQuery.map(row => row.SEM_ID);

//         // Step 3: Retrieve attendance data from attendance_table for the retrieved sem_id
//         const attendanceQuery = await db('attendance_table')
//             .select('DATE', 'STUDENTS')
//             .whereIn('SEM_ID', semIds);

//         if (attendanceQuery.length === 0) {
//             return res.status(404).json({ message: 'No attendance data found for the specified criteria' });
//         }

//         // Step 4: Correlate attendance data with the list of students
//         const attendanceData = studentsQuery.map(student => {
//             const lectures = [];
//             const dates = [];

//             attendanceQuery.forEach(record => {
//                 dates.push(record.DATE.toISOString().split('T')[0]); // Format date as 'yyyy-mm-dd'
//                 lectures.push(record.Students.includes(student.PRN) ? 1 : 0);
//             });

//             return {
//                 prn: student.PRN,
//                 name: student.NAME, // Adjusted to match your student_info table columns
//                 lectures,
//                 dates
//             };
//         });

//         // Step 5: Send the response back to the client
//         res.status(200).json(attendanceData);

//     } catch (error) {
//         console.error('Error fetching attendance data:', error);
//         res.status(500).send({ error: 'Internal Server Error' });
//     }
// }

// export const fetchLectureDates = async (req, res) => {
//     try {
//         console.log('hiubui')
//         const { semester, branch, division, batch, subject } = req.query;
//         console.log(semester, branch, division, batch, subject)

//         // Step 1: Fetch SEM_ID from sem_info based on provided parameters
//         const semInfoQuery = await db('sem_info')
//             .select('SEM_ID')
//             .where({
//                 SEMESTER: semester,
//                 BRANCH: branch,
//                 DIVISION: division,
//                 BATCH: batch,
//                 SUB_ID: subject
//             })
//             .first();

//         if (!semInfoQuery) {
//             return res.status(404).json({ message: 'No records found for the given parameters' });
//         }

//         const semId = semInfoQuery.SEM_ID;

//         // Step 2: Fetch lecture dates from attendance_table based on SEM_ID
//         const lectureDatesQuery = await db('attendance_table')
//             .distinct(db.raw("DATE_FORMAT(DATE, '%Y-%m-%d') AS DATE")) // Format DATE to 'yyyy-mm-dd'
//             .where({ SEM_ID: semId })
//             .andWhere('DATE', '<', db.raw('CURDATE()')) // Fetch only past lectures
//             .orderBy('DATE', 'desc'); // Order dates descending (latest first)

//         const lectureDates = lectureDatesQuery.map(row => row.DATE);
//         console.log(lectureDates)
//         // Step 3: Send the lecture dates as a response
//         res.status(200).json({ lectureDates });
//     } catch (error) {
//         console.error('Error fetching lecture dates:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

// export const getAttendanceData = async (req, res) => {
//     try {
//         const { semester, branch, batch, division, subject, date } = req.query; // Extract input parameters from the request query
//         console.log(semester, branch, batch, division, subject, date)
//         // Step 1: Retrieve the list of students in the specified sem, branch, batch, and div
//         const studentsQuery = await db('student_info')
//             .select('PRN', 'EMAIL') // Adjusted to match your student_info table columns
//             .where({ SEMESTER: semester, BRANCH: branch, BATCH: batch, DIVISON: division });
//         console.log('yyy')
//         if (studentsQuery.length === 0) {
//             return res.status(404).json({ message: 'No students found for the specified criteria' });
//         }
//         console.log('hi')
//         // Step 2: Retrieve the sem_id for the specified criteria from the sem_info table
//         const semInfoQuery = await db('sem_info')
//             .select('SEM_ID')
//             .where({ SEMESTER: semester, BRANCH: branch, BATCH: batch, DIVISION: division, SUB_ID: subject })
//             .first();

//         if (!semInfoQuery) {
//             return res.status(404).json({ message: 'No sem_id found for the specified criteria' });
//         }

//         const semId = semInfoQuery.SEM_ID;

//         // Step 3: Retrieve attendance data from attendance_table for the retrieved sem_id and date
//         const attendanceQuery = await db('attendance_table')
//             .select('Students')
//             .where({ SEM_ID: semId, DATE: date });

//         // Extract PRNs of present students from attendance records
//         const presentPRNs = attendanceQuery.map(record => record.Students);

//         // Step 4: Prepare attendance data with all students and their attendance records
//         const attendanceData = studentsQuery.map(student => {
//             const name = student.EMAIL; // For now, using EMAIL as name, adjust as per your actual data structure
//             const prn = student.PRN;
//             const attendance = presentPRNs.includes(student.PRN) ? 1 : 0;
//             return { name, prn, attendance };
//         });
//         console.log(attendanceData)
//         console.log('hi')
//         // Step 5: Send the response back to the client
//         res.status(200).json(attendanceData);

//     } catch (error) {
//         console.error('Error fetching attendance data:', error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// };

// Function to update attendance data
// export const updateAttendanceData = async (req, res) => {
//   try {
//     const { semester, branch, division, batch, subject, date, attendance } = req.body;

//     // Step 1: Fetch SEM_ID from sem_info based on provided parameters
//     const semInfoQuery = await knex('sem_info')
//       .select('SEM_ID')
//       .where({
//         SEMESTER: semester,
//         BRANCH: branch,
//         DIVISION: division,
//         BATCH: batch,
//         SUB_ID: subject
//       })
//       .first();

//     if (!semInfoQuery) {
//       return res.status(404).json({ message: 'No records found for the given parameters' });
//     }

//     const semId = semInfoQuery.SEM_ID;

//     // Extract PRNs of present students (where attendance is 1)
//     const presentPRNs = attendance
//       .filter(student => student.attendance === 1)
//       .map(student => student.prn);

//     // Step 2: Update or insert attendance records in attendance_table based on SEM_ID and date
//     await knex.transaction(async (trx) => {
//       // Update or insert new attendance records for the given SEM_ID and date
//       await trx.raw(`
//         INSERT INTO attendance_table (SEM_ID, DATE, ATTENDANCE)
//         VALUES (?, ?, ?)
//         ON DUPLICATE KEY UPDATE ATTENDANCE = VALUES(ATTENDANCE)
//       `, [semId, date, presentPRNs.join(',')]);
//     });

//     // Step 3: Send success response
//     res.status(200).json({ message: 'Attendance records updated successfully' });
//   } catch (error) {
//     console.error('Error updating attendance records:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };


export const getFacultyTeachingData = async (req, res) => {
  try {
    const { faculty_id } = req.query; // Extract faculty_id from query parameters

    // Step 1: Get all relevant data from sem_info and subject for the given faculty_id
    const infoTableQuery = await db('sem_info')
      .select('sem_info.SEMESTER', 'sem_info.BRANCH', 'sem_info.DIVISION', 'sem_info.BATCH', 'sem_info.SUBJECT_ID', 'subject.TYPE')
      .leftJoin('subject', 'sem_info.SUBJECT_ID', 'subject.SUBJECT_ID')
      .where({ FACULTY_ID: faculty_id });

    if (infoTableQuery.length > 0) {
      // Initialize empty objects to hold the aggregated data
      const semesterBranches = {};
      const branchDivisions = {};
      const divisionBatches = {};
      const subjectDetails = {};

      // Aggregate the results
      infoTableQuery.forEach(row => {
        const semester = row.SEMESTER;
        const branch = row.BRANCH;
        const division = row.DIVISION;
        const batch = row.BATCH;
        const subjectId = row.SUBJECT_ID;
        const subjectType = row.TYPE;

        // Initialize semester data
        if (!semesterBranches[semester]) {
          semesterBranches[semester] = [];
        }
        if (!semesterBranches[semester].includes(branch)) {
          semesterBranches[semester].push(branch);
        }

        // Initialize branch data
        if (!branchDivisions[semester]) {
          branchDivisions[semester] = {};
        }
        if (!branchDivisions[semester][branch]) {
          branchDivisions[semester][branch] = [];
        }
        if (!branchDivisions[semester][branch].includes(division)) {
          branchDivisions[semester][branch].push(division);
        }

        // Initialize division data
        if (!divisionBatches[semester]) {
          divisionBatches[semester] = {};
        }
        if (!divisionBatches[semester][branch]) {
          divisionBatches[semester][branch] = {};
        }
        if (!divisionBatches[semester][branch][division]) {
          divisionBatches[semester][branch][division] = [];
        }
        if (!divisionBatches[semester][branch][division].includes(batch)) {
          divisionBatches[semester][branch][division].push(batch);
        }

        // Initialize subject details
        if (!subjectDetails[semester]) {
          subjectDetails[semester] = {};
        }
        if (!subjectDetails[semester][branch]) {
          subjectDetails[semester][branch] = {};
        }
        if (!subjectDetails[semester][branch][division]) {
          subjectDetails[semester][branch][division] = {};
        }
        if (!subjectDetails[semester][branch][division][batch]) {
          subjectDetails[semester][branch][division][batch] = {};
        }
        if (!subjectDetails[semester][branch][division][batch][subjectId]) {
          subjectDetails[semester][branch][division][batch][subjectId] = subjectType;
        }
      });

      // Construct the final structured response
      const flattenedData = {
        semesters: Object.keys(semesterBranches),
        branches: semesterBranches,
        divisions: branchDivisions,
        batches: divisionBatches,
        subjects: subjectDetails
      };

      // Step 3: Send the structured data as a response
      res.status(200).json(flattenedData);
    } else {
      // No records found for the given faculty_id
      res.status(404).json({ message: 'No teaching data found for the given faculty ID' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




export const getParticularData = async (req, res) => {
  try {
    const { sem, branch, batch, div, sub_id } = req.query; // Extract input parameters from the request body

    console.log(sem, branch, batch, div, sub_id);

    // Step 1: Retrieve the list of students based on the provided criteria
    let studentsQuery = db('student_info')
      .select('PRN', 'NAME')
      .where({ SEMESTER: sem, BRANCH: branch, DIVISION: div });

    if (batch) {
      // Filter by batch if provided
      studentsQuery = studentsQuery.where({ BATCH: batch });
    }

    const students = await studentsQuery;

    if (students.length === 0) {
      return res.status(404).json({ message: 'No students found for the specified criteria' });
    }

    // Step 2: Retrieve the sem_id for the specified criteria
    let infoTableQuery = db('sem_info')
      .select('SEM_ID')
      .where({ SEMESTER: sem, BRANCH: branch, DIVISION: div, SUBJECT_ID: sub_id });

    if (!batch) {
      // If batch is not provided, include all batches in the query
      infoTableQuery = db('sem_info')
        .select('SEM_ID')
        .where({ SEMESTER: sem, BRANCH: branch, DIVISION: div, SUBJECT_ID: sub_id });
    } else {
      // If batch is provided, include it in the query
      infoTableQuery = infoTableQuery.where({ BATCH: batch });
    }

    const infoTableResults = await infoTableQuery;

    if (infoTableResults.length === 0) {
      return res.status(404).json({ message: 'No sem_id found for the specified criteria' });
    }

    const semIds = infoTableResults.map(row => row.SEM_ID);

    // Step 3: Retrieve attendance data based on the retrieved sem_id
    const attendanceQuery = await db('attendance_table')
      .select('DATE', 'STUDENTS')
      .whereIn('SEM_ID', semIds);

    if (attendanceQuery.length === 0) {
      return res.status(404).json({ message: 'No attendance data found for the specified criteria' });
    }

    // Step 4: Correlate attendance data with the list of students
    const attendanceData = students.map(student => {
      const lectures = [];
      const dates = [];

      attendanceQuery.forEach(record => {
        dates.push(record.DATE.toISOString().split('T')[0]); // Format date as 'yyyy-mm-dd'
        lectures.push(record.STUDENTS.includes(student.PRN) ? 1 : 0);
      });

      return {
        prn: student.PRN,
        name: student.NAME,
        lectures,
        dates
      };
    });

    // Step 5: Send the response back to the client
    res.status(200).json({ attendanceData });

  } catch (error) {
    console.error('Error fetching attendance data:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
}



// export const getAllAttendanceData= async(req,res)=>{
//     try {
//         const { semester, branch, division, batch, subject } = req.query;
        
//         // Fetch SEM_ID from sem_info based on provided parameters
//         const semInfoQuery = await db('sem_info')
//             .select('SEM_ID')
//             .where({
//                 SEMESTER: semester,
//                 BRANCH: branch,
//                 DIVISION: division,
//                 BATCH: batch,
//                 SUB_ID: subject
//             })
//             .first();

//         if (!semInfoQuery) {
//             return res.status(404).json({ message: 'No records found for the given parameters' });
//         }

//         const semId = semInfoQuery.SEM_ID;

//         // Fetch lecture dates and attendance data from attendance_table
//         const attendanceData = await db('attendance_table')
//             .select('DATE', 'Students')
//             .where({ SEM_ID: semId })
//             .andWhere('DATE', '<=', db.raw('CURDATE()'))
//             .orderBy('DATE', 'desc');

//         if (attendanceData.length === 0) {
//             return res.status(404).json({ message: 'No attendance records found for the given criteria' });
//         }

//         // Retrieve the list of students in the specified sem, branch, batch, and div
//         const studentsQuery = await db('student_info')
//             .select('PRN', 'EMAIL') // Adjusted to match your student_info table columns
//             .where({ SEMESTER: semester, BRANCH: branch, BATCH: batch, DIVISON: division });

//         if (studentsQuery.length === 0) {
//             return res.status(404).json({ message: 'No students found for the specified criteria' });
//         }

//         // Prepare attendance data for each date
//         const formattedAttendanceData = attendanceData.map(record => {
//             const presentPRNs = record.Students.split(',');
//             return {
//                 date: record.DATE,
//                 students: studentsQuery.map(student => ({
//                     name: student.EMAIL, // Replace with student name if available
//                     prn: student.PRN,
//                     attendance: presentPRNs.includes(student.PRN) ? 1 : 0
//                 }))
//             };
//         });

//         // Send the formatted attendance data as a response
//         res.status(200).json({ attendance: formattedAttendanceData });
//     } catch (error) {
//         console.error('Error fetching attendance data:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// }

// export const getAllAttendanceData = async (req, res) => {
//   try {
//       const { semester, branch, division, batch, subject } = req.query;
      
//       // Fetch all SEM_IDs from sem_info based on provided parameters
//       const semIdsQuery = await db('sem_info')
//           .select('SEM_ID')
//           .where({
//               SEMESTER: semester,
//               BRANCH: branch,
//               DIVISION: division,
//               SUBJECT_ID: subject
//           });

//       if (semIdsQuery.length === 0) {
//           return res.status(404).json({ message: 'No records found for the given parameters' });
//       }

//       const semIds = semIdsQuery.map(row => row.SEM_ID);

//       // Base query for attendance data
//       let attendanceQuery = db('attendance_table')
//           .select('DATE', 'Students', 'SEM_ID') // Include SEM_ID to handle multiple SEM_IDs
//           .whereIn('SEM_ID', semIds)
//           .andWhere('DATE', '<=', db.raw('CURDATE()'))
//           .orderBy('DATE', 'desc');

//       // Modify the query based on whether batch is specified
//       if (batch) {
//           attendanceQuery = attendanceQuery.andWhere({ BATCH: batch });
//       }

//       const attendanceData = await attendanceQuery;

//       if (attendanceData.length === 0) {
//           return res.status(404).json({ message: 'No attendance records found for the given criteria' });
//       }

//       // Retrieve the list of students in the specified sem, branch, div, and optionally batch
//       const studentsQuery = db('student_info')
//           .select('PRN', 'NAME') // Adjusted to match your student_info table columns
//           .where({ SEMESTER: semester, BRANCH: branch, DIVISION: division });

//       if (batch) {
//           studentsQuery.andWhere({ BATCH: batch });
//       }

//       const students = await studentsQuery;

//       if (students.length === 0) {
//           return res.status(404).json({ message: 'No students found for the specified criteria' });
//       }

//       // Prepare attendance data for each date
//       const formattedAttendanceData = attendanceData.map(record => {
//           const presentPRNs = record.Students.split(',');
//           return {
//               date: record.DATE,
//               students: students.map(student => ({
//                   name: student.NAME, // Replace with student name if available
//                   prn: student.PRN,
//                   attendance: presentPRNs.includes(student.PRN) ? 1 : 0
//               }))
//           };
//       });

//       // Send the formatted attendance data as a response
//       res.status(200).json({ attendance: formattedAttendanceData });
//   } catch (error) {
//       console.error('Error fetching attendance data:', error);
//       res.status(500).json({ message: 'Internal server error' });
//   }
// }


// export const updateAttendanceData = async (req, res) => {
//     try {
//       const { semester, branch, division, batch, subject, attendance } = req.body;

//       // Fetch SEM_ID from sem_info based on provided parameters
//       const semInfoQuery = await db('sem_info')
//         .select('SEM_ID')
//         .where({
//           SEMESTER: semester,
//           BRANCH: branch,
//           DIVISION: division,
//           BATCH: batch,
//           SUB_ID: subject
//         })
//         .first();
  
//       if (!semInfoQuery) {
//         return res.status(404).json({ message: 'No records found for the given parameters' });
//       }
  
//       const semId = semInfoQuery.SEM_ID;
  
//       await db.transaction(async (trx) => {
//         // Insert or update records for each date
//         for (const record of attendance) {
//           const presentPRNs = record.students
//             .filter(student => student.attendance === 1)
//             .map(student => student.prn);

//             const formattedDate = new Date(record.date).toISOString().split('T')[0]; // Format date as yyyy-mm-dd
  
//             await trx.raw(`
//                 INSERT INTO attendance_table (SEM_ID, DATE, Students)
//                 VALUES (?, ?, ?)
//                 ON DUPLICATE KEY UPDATE Students = VALUES(Students)
//             `, [semId, formattedDate, presentPRNs.join(',')]);
//         }
//       });
  
//       res.status(200).json({ message: 'Attendance records updated successfully' });
//     } catch (error) {
//       console.error('Error updating attendance records:', error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   };
  

export const updateAttendanceData = async (req, res) => {
  try {
    const { semester, branch, division, subject, faculty_id, attendance } = req.body;

    await db.transaction(async (trx) => {
      for (const record of attendance) {
        // Use the date directly as provided, assuming it is in the correct format and timezone
        const date = new Date(record.date);

        const year = date.getUTCFullYear(); // Use UTC methods
        const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-based
        const day = String(date.getUTCDate()).padStart(2, '0');
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const seconds = String(date.getUTCSeconds()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        console.log(formattedDate); // For debugging, ensures the date is formatted correctly

        const semInfoQuery = await trx('sem_info')
          .select('SEM_ID')
          .where({
            SEMESTER: semester,
            BRANCH: branch,
            DIVISION: division,
            SUBJECT_ID: subject,
            FACULTY_ID: faculty_id
          })
          .first();

        if (!semInfoQuery) {
          return res.status(404).json({ message: `SEM_ID not found for the given criteria` });
        }

        const semId = semInfoQuery.SEM_ID;

        const presentPRNs = record.students
          .filter(student => student.attendance === 1)
          .map(student => student.prn);

        await trx.raw(`
          INSERT INTO attendance_table (SEM_ID, DATE, Students)
          VALUES (?, ?, ?)
          ON DUPLICATE KEY UPDATE Students = VALUES(Students)
        `, [semId, formattedDate, presentPRNs.join(',')]);
      }
    });

    res.status(200).json({ message: 'Attendance records updated successfully' });
  } catch (error) {
    console.error('Error updating attendance data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};









export const getAllAttendanceData = async (req, res) => {
  try {
    const { semester, branch, division, batch, subject } = req.query;

    // Fetch all SEM_IDs from sem_info based on provided parameters
    const semIdsQuery = await db('sem_info')
      .select('SEM_ID')
      .where({
        SEMESTER: semester,
        BRANCH: branch,
        DIVISION: division,
        SUBJECT_ID: subject
      });

    if (semIdsQuery.length === 0) {
      return res.status(404).json({ message: 'No records found for the given parameters' });
    }

    const semIds = semIdsQuery.map(row => row.SEM_ID);

    // Base query for attendance data
    let attendanceQuery = db('attendance_table')
      .select('DATE', 'Students', 'SEM_ID') // Include SEM_ID
      .whereIn('SEM_ID', semIds)
      .andWhere('DATE', '<=', db.raw('CURDATE()'))
      .orderBy('DATE', 'desc');

    // Modify the query based on whether batch is specified
    if (batch) {
      attendanceQuery = attendanceQuery.andWhere({ BATCH: batch });
    }

    const attendanceData = await attendanceQuery;

    if (attendanceData.length === 0) {
      return res.status(404).json({ message: 'No attendance records found for the given criteria' });
    }

    // Retrieve the list of students in the specified semester, branch, division, and optionally batch
    const studentsQuery = db('student_info')
      .select('PRN', 'NAME') // Adjust to match your student_info table columns
      .where({ SEMESTER: semester, BRANCH: branch, DIVISION: division });

    if (batch) {
      studentsQuery.andWhere({ BATCH: batch });
    }

    const students = await studentsQuery;

    if (students.length === 0) {
      return res.status(404).json({ message: 'No students found for the specified criteria' });
    }

    // Prepare attendance data for each date
    const formattedAttendanceData = attendanceData.map(record => {
      const presentPRNs = record.Students.split(',');
      return {
        date: record.DATE, // Send the exact datetime value from the database
        semId: record.SEM_ID, // Include SEM_ID in the response
        students: students.map(student => ({
          name: student.NAME,
          prn: student.PRN,
          attendance: presentPRNs.includes(student.PRN) ? 1 : 0
        }))
      };
    });

    // Send the formatted attendance data as a response
    res.status(200).json({ attendance: formattedAttendanceData });
  } catch (error) {
    console.error('Error fetching attendance data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

