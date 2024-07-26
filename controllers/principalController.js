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


export const fetchAttendanceData = async (req, res) => {
    const { semester, batch, division, branch } = req.query;
    console.log(semester, branch, division, batch);
    try {
      // Step 1: Get SEM_IDs and SUBJECTs from sem_info table
      const semInfoQuery = await db('sem_info')
        .select('SEM_ID', 'SUB_ID')
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
        .select('PRN', 'EMAIL')
        .where({
          SEMESTER: parseInt(semester),
          BRANCH: branch,
          DIVISON: division,
          BATCH: batch
        });
  
      // Step 3: Prepare the structure to store attendance data
      const attendanceData = [];
  
      // Step 4: Iterate over each student and each subject to fetch attendance
      for (let student of studentsQuery) {
        const studentData = {
          prn: student.PRN,
          name: student.EMAIL,
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
          studentData.subjects[subject.SUB_ID] = attendanceArray;
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