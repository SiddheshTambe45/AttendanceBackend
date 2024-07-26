import db from '../db/knexfile.js';


// export const getCriteria= async(req,res)=>{
//     try {
//         const { branch } = req.query; // Extract branch from query parameters
//         console.log(branch);
    
//         // Step 1: Get all relevant data from sem_info for the given branch
//         const semInfoQuery = await db('sem_info')
//           .select('SEMESTER', 'BRANCH', 'DIVISION', 'BATCH', 'SUBJECT_ID')
//           .where({ BRANCH: branch });
    
//         if (semInfoQuery.length > 0) {
//           // Step 2: Aggregate the results into arrays
//           const aggregatedData = {
//             semester: [],
//             division: [],
//             batch: [],
//             subject: [],
//           };
    
//           semInfoQuery.forEach(row => {
//             if (!aggregatedData.semester.includes(row.SEMESTER)) {
//               aggregatedData.semester.push(row.SEMESTER);
//             }
//             if (!aggregatedData.division.includes(row.DIVISION)) {
//               aggregatedData.division.push(row.DIVISION);
//             }
//             if (!aggregatedData.batch.includes(row.BATCH)) {
//               aggregatedData.batch.push(row.BATCH);
//             }
//             if (!aggregatedData.subject.includes(row.SUBJECT_ID)) {
//               aggregatedData.subject.push(row.SUBJECT_ID);
//             }
//           });
    
//           // Step 3: Send the aggregated data as a response
//           res.status(200).json(aggregatedData);
//         } else {
//           // No records found for the given branch
//           res.status(404).json({ message: 'No criteria data found for the given branch' });
//         }
//       } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: 'Internal server error' });
//       }
// }


// export const getCriteria = async (req, res) => {
//   try {
//     const { branch } = req.query; // Extract branch from query parameters
//     console.log(branch);

//     // Step 1: Get all relevant data from sem_info for the given branch
//     const semInfoQuery = await db('sem_info')
//       .select('sem_info.SEMESTER', 'sem_info.DIVISION', 'sem_info.BATCH', 'sem_info.SUBJECT_ID', 'subject.TYPE')
//       .leftJoin('subject', 'sem_info.SUBJECT_ID', 'subject.SUBJECT_ID')
//       .where('sem_info.BRANCH', branch);

//     if (semInfoQuery.length > 0) {
//       // Initialize empty objects to hold the nested data
//       const semesters = new Set();
//       const divisions = {};
//       const batches = {};
//       const subjects = {};

//       // Aggregate the results
//       semInfoQuery.forEach(row => {
//         // Add semester to the set
//         semesters.add(row.SEMESTER);

//         // Aggregate divisions
//         if (!divisions[row.SEMESTER]) {
//           divisions[row.SEMESTER] = [];
//         }
//         if (!divisions[row.SEMESTER].includes(row.DIVISION)) {
//           divisions[row.SEMESTER].push(row.DIVISION);
//         }

//         // Aggregate batches
//         if (!batches[row.SEMESTER]) {
//           batches[row.SEMESTER] = {};
//         }
//         if (!batches[row.SEMESTER][row.DIVISION]) {
//           batches[row.SEMESTER][row.DIVISION] = ["ALL"];
//         }
//         if (!batches[row.SEMESTER][row.DIVISION].includes(row.BATCH)) {
//           batches[row.SEMESTER][row.DIVISION].push(row.BATCH);
//         }

//         // Aggregate subjects with types
//         if (!subjects[row.SEMESTER]) {
//           subjects[row.SEMESTER] = {};
//         }
//         if (!subjects[row.SEMESTER][row.DIVISION]) {
//           subjects[row.SEMESTER][row.DIVISION] = {};
//         }
//         if (!subjects[row.SEMESTER][row.DIVISION][row.BATCH]) {
//           subjects[row.SEMESTER][row.DIVISION][row.BATCH] = {};
//         }
//         subjects[row.SEMESTER][row.DIVISION][row.BATCH][row.SUBJECT_ID] = row.TYPE;
//       });

//       // Construct the final structure
//       const aggregatedData = {
//         semesters: Array.from(semesters),
//         divisions,
//         batches,
//         subjects,
//       };

//       // Step 3: Send the aggregated data as a response
//       res.status(200).json(aggregatedData);
//     } else {
//       // No records found for the given branch
//       res.status(404).json({ message: 'No criteria data found for the given branch' });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };




// export const fetchAttendanceData = async (req, res) => {
//     const { semester, batch, division, branch } = req.query;
//     console.log(semester, branch, division, batch);
//     try {
//       // Step 1: Get SEM_IDs and SUBJECTs from sem_info table
//       const semInfoQuery = await db('sem_info')
//         .select('SEM_ID', 'SUBJECT_ID')
//         .where({
//           SEMESTER: parseInt(semester),
//           BRANCH: branch,
//           DIVISION: division, //make divison
//           BATCH: batch
//         });
  
//       if (semInfoQuery.length === 0) {
//         return res.status(404).json({ message: 'No records found for the given criteria' });
//       }
  
//       // Step 2: Get all students for the given criteria from student_info table
//       const studentsQuery = await db('student_info')
//         .select('PRN', 'NAME')
//         .where({
//           SEMESTER: parseInt(semester),
//           BRANCH: branch,
//           DIVISION: division,
//           BATCH: batch
//         });
  
//       // Step 3: Prepare the structure to store attendance data
//       const attendanceData = [];
  
//       // Step 4: Iterate over each student and each subject to fetch attendance
//       for (let student of studentsQuery) {
//         const studentData = {
//           prn: student.PRN,
//           name: student.NAME,
//           subjects: {}
//         };
  
//         for (let subject of semInfoQuery) {
//           const attendanceQuery = await db('attendance_table')
//             .select('DATE')
//             .where('SEM_ID', subject.SEM_ID)
//             .andWhere('Students', 'like', `%${student.PRN}%`); // Correct usage of LIKE
  
//           // Prepare attendance array with 1s and 0s based on presence
//           const attendanceArray = attendanceQuery.map(entry => 1); // Assume all entries are present
  
//           // Add subject attendance to studentData
//           studentData.subjects[subject.SUBJECT_ID] = attendanceArray;
//         }
  
//         attendanceData.push(studentData);
//       }
  
//       // Step 5: Send formatted attendance data as response
//       res.status(200).json(attendanceData);
  
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   };



// Define the getCriteria controller for faculty-subject selection

export const getCriteria = async (req, res) => {
  try {
    const { branch } = req.query; // Extract branch from query parameters
    console.log(branch);

    // Step 1: Get all relevant data from sem_info for the given branch
    const semInfoQuery = await db('sem_info')
      .select('sem_info.SEMESTER', 'sem_info.DIVISION', 'sem_info.BATCH', 'sem_info.SUBJECT_ID', 'subject.TYPE')
      .leftJoin('subject', 'sem_info.SUBJECT_ID', 'subject.SUBJECT_ID')
      .where('sem_info.BRANCH', branch);

    if (semInfoQuery.length > 0) {
      // Initialize empty objects to hold the nested data
      const semesters = new Set();
      const divisions = {};
      const batches = {};

      // Aggregate the results
      semInfoQuery.forEach(row => {
        // Add semester to the set
        semesters.add(row.SEMESTER);

        // Aggregate divisions
        if (!divisions[row.SEMESTER]) {
          divisions[row.SEMESTER] = [];
        }
        if (!divisions[row.SEMESTER].includes(row.DIVISION)) {
          divisions[row.SEMESTER].push(row.DIVISION);
        }

        // Aggregate batches
        if (!batches[row.SEMESTER]) {
          batches[row.SEMESTER] = {};
        }
        if (!batches[row.SEMESTER][row.DIVISION]) {
          batches[row.SEMESTER][row.DIVISION] = ["ALL"];
        }
        if (!batches[row.SEMESTER][row.DIVISION].includes(row.BATCH)) {
          batches[row.SEMESTER][row.DIVISION].push(row.BATCH);
        }
      });

      // Construct the final structure without subjects
      const aggregatedData = {
        semesters: Array.from(semesters),
        divisions,
        batches
      };

      // Step 3: Send the aggregated data as a response
      res.status(200).json(aggregatedData);
    } else {
      // No records found for the given branch
      res.status(404).json({ message: 'No criteria data found for the given branch' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// export const fetchAttendanceData = async (req, res) => {
//   const { semester, batch, division, branch } = req.query;
//   console.log(semester, branch, division, batch);

//   try {
//     // Step 1: Get SEM_IDs and SUBJECTs from sem_info table
//     let semInfoQuery;

//     if (batch === 'ALL') {
//       // If batch is "ALL", fetch SEM_IDs and SUBJECTs for all batches in the division
//       semInfoQuery = await db('sem_info')
//         .select('SEM_ID', 'SUBJECT_ID')
//         .where({
//           SEMESTER: parseInt(semester),
//           BRANCH: branch,
//           DIVISION: division
//         });
//     } else {
//       // Otherwise, filter by the specific batch
//       semInfoQuery = await db('sem_info')
//         .select('SEM_ID', 'SUBJECT_ID')
//         .where({
//           SEMESTER: parseInt(semester),
//           BRANCH: branch,
//           DIVISION: division,
//           BATCH: batch
//         });
//     }

//     if (semInfoQuery.length === 0) {
//       return res.status(404).json({ message: 'No records found for the given criteria' });
//     }

//     // Step 2: Get all students for the given criteria from student_info table
//     const studentsQuery = await db('student_info')
//       .select('PRN', 'NAME', 'BATCH') // Include batch information
//       .where({
//         SEMESTER: parseInt(semester),
//         BRANCH: branch,
//         DIVISION: division
//       });

//     // Step 3: Prepare the structure to store attendance data
//     const attendanceData = [];

//     // Step 4: Iterate over each student and each subject to fetch attendance
//     for (let student of studentsQuery) {
//       const studentData = {
//         prn: student.PRN,
//         name: student.NAME,
//         batch: student.BATCH, // Include batch information
//         subjects: {}
//       };

//       for (let subject of semInfoQuery) {
//         const attendanceQuery = await db('attendance_table')
//           .select('DATE')
//           .where('SEM_ID', subject.SEM_ID)
//           .andWhere('STUDENTS', 'like', `%${student.PRN}%`); // Correct usage of LIKE

//         // Prepare attendance array with 1s and 0s based on presence
//         const attendanceArray = attendanceQuery.map(entry => 1); // Assume all entries are present

//         // Add subject attendance to studentData
//         studentData.subjects[subject.SUBJECT_ID] = attendanceArray;
//       }

//       attendanceData.push(studentData);
//     }

//     // Step 5: Send formatted attendance data as response
//     res.status(200).json(attendanceData);

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

export const fetchAttendanceData = async (req, res) => {
  const { semester, batch, division, branch } = req.query;
  console.log(semester, branch, division, batch);

  try {
    // Step 1: Get SEM_IDs, SUBJECTs, and their TYPEs from sem_info and subject tables
    let semInfoQuery;

    if (batch === 'ALL') {
      // If batch is "ALL", fetch SEM_IDs, SUBJECTs, and TYPEs for all batches in the division
      semInfoQuery = await db('sem_info')
        .join('subject', 'sem_info.SUBJECT_ID', '=', 'subject.SUBJECT_ID')
        .select('sem_info.SEM_ID', 'sem_info.SUBJECT_ID', 'subject.TYPE')
        .where({
          'sem_info.SEMESTER': parseInt(semester),
          'sem_info.BRANCH': branch,
          'sem_info.DIVISION': division
        });
    } else {
      // Otherwise, filter by the specific batch
      semInfoQuery = await db('sem_info')
        .join('subject', 'sem_info.SUBJECT_ID', '=', 'subject.SUBJECT_ID')
        .select('sem_info.SEM_ID', 'sem_info.SUBJECT_ID', 'subject.TYPE')
        .where({
          'sem_info.SEMESTER': parseInt(semester),
          'sem_info.BRANCH': branch,
          'sem_info.DIVISION': division,
          'sem_info.BATCH': batch
        });
    }

    if (semInfoQuery.length === 0) {
      return res.status(404).json({ message: 'No records found for the given criteria' });
    }

    // Step 2: Get all students for the given criteria from student_info table
    const studentsQuery = await db('student_info')
      .select('PRN', 'NAME', 'BATCH') // Include batch information
      .where({
        SEMESTER: parseInt(semester),
        BRANCH: branch,
        DIVISION: division
      });

    // Step 3: Prepare the structure to store attendance data
    const attendanceData = [];

    // Step 4: Iterate over each student and each subject to fetch attendance
    for (let student of studentsQuery) {
      const studentData = {
        prn: student.PRN,
        name: student.NAME,
        batch: student.BATCH, // Include batch information
        subjects: {}
      };

      for (let subject of semInfoQuery) {
        const attendanceQuery = await db('attendance_table')
          .select('DATE')
          .where('SEM_ID', subject.SEM_ID)
          .andWhere('STUDENTS', 'like', `%${student.PRN}%`); // Correct usage of LIKE

        // Prepare attendance array with 1s and 0s based on presence
        const attendanceArray = attendanceQuery.map(entry => 1); // Assume all entries are present

        // Add subject attendance to studentData including the subject type
        studentData.subjects[subject.SUBJECT_ID] = {
          type: subject.TYPE, // Include the subject type
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




export const getCriteriaFacSub = async (req, res) => {
  try {
    console.log('hi')
    const { hodDepartment } = req.query; // Extract hodDepartment from query parameters
    console.log(`HOD Department: ${hodDepartment}`);

    // Determine the criteria based on the HOD department
    let semInfoQuery;

    if (hodDepartment === 'FE') {
      // Fetch data for 'FE' department
      semInfoQuery = await db('sem_info')
        .select('SEMESTER', 'BRANCH', 'DIVISION', 'BATCH')
        .whereIn('SEMESTER', [1, 2]); // Only semesters 1 and 2
    } else {
      // Fetch data for other departments
      semInfoQuery = await db('sem_info')
        .select('SEMESTER', 'BRANCH', 'DIVISION', 'BATCH')
        .where('BRANCH', hodDepartment) // Match branch to department
        .andWhereBetween('SEMESTER', [3, 8]); // Semesters 3 to 8
    }

    if (semInfoQuery.length > 0) {
      // Aggregate the results into arrays
      const aggregatedData = {
        semester: [],
        division: [],
        batch: [],
        branch: [],
      };

      semInfoQuery.forEach(row => {
        if (!aggregatedData.semester.includes(row.SEMESTER)) {
          aggregatedData.semester.push(row.SEMESTER);
        }
        if (!aggregatedData.division.includes(row.DIVISION)) {
          aggregatedData.division.push(row.DIVISION);
        }
        if (!aggregatedData.batch.includes(row.BATCH)) {
          aggregatedData.batch.push(row.BATCH);
        }
        if (!aggregatedData.branch.includes(row.BRANCH)) {
          aggregatedData.branch.push(row.BRANCH);
        }
      });

      console.log(aggregatedData)
      // Send the aggregated data as a response
      res.status(200).json(aggregatedData);
    } else {
      // No records found
      res.status(404).json({ message: 'No criteria data found for the given department' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Define the getSubjectsAndFaculty controller
export const getSubjectsAndFaculty = async (req, res) => {
  try {
    console.log('hiihih')
    const { hodDepartment, branch, semester } = req.query; // Extract department, branch, and semester from query parameters
    console.log(`Requested Department: ${hodDepartment}, Branch: ${branch}, Semester: ${semester}`);

    // Step 1: Fetch faculty members from the faculty table with the specified department
    const facultyQuery = await db('faculty')
      .select('faculty_id', 'faculty_name')
      .where('department', hodDepartment);

    console.log(facultyQuery)

    // Step 2: Fetch subjects from the subject table with the specified branch and semester
    const subjectsQuery = await db('subject')
      .select('subject_id', 'subject_name')
      .where({
        branch: branch,
        semester: semester,
      });
    
      console.log(subjectsQuery)

    // Check if any subjects or faculty were found
    if (facultyQuery.length > 0 || subjectsQuery.length > 0) {
      // Aggregate the results
      const responseData = {
        subjects: subjectsQuery.map(subject => ({
          subjectId: subject.subject_id,
          subjectName: subject.subject_name,
        })),
        teachers: facultyQuery.map(faculty => ({
          facultyId: faculty.faculty_id,
          facultyName: faculty.faculty_name,
        })),
      };

      // Send the aggregated data as a response
      res.status(200).json(responseData);
    } else {
      // No records found for the given criteria
      res.status(404).json({ message: 'No data found for the given criteria' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Define the updateSubjects controller
export const updateSubjects = async (req, res) => {
  try {
    // Extract the data directly from the request body
    const dataToSend = req.body; 
    console.log(dataToSend);

    // Define mappings for branch, division, and batch to numeric values
    const branchMapping = {
      IOT: 8,
      // Add other branch mappings if necessary
    };

    const divisionMapping = {
      H: 8,
      // Add other division mappings if necessary
    };

    const batchMapping = {
      H2: 2,
      // Add other batch mappings if necessary
    };

    // Process each entry in dataToSend
    for (const entry of dataToSend) {
      const { semester, branch, division, batch, subject_id, faculty_id } = entry;

      // Get numeric values for branch, division, and batch
      const branchValue = branchMapping[branch] || 0;
      const divisionValue = divisionMapping[division] || 0;
      const batchValue = batchMapping[batch] || 0;

      // Convert faculty_id to numeric ID if needed
      const numericFacultyId = faculty_id.startsWith('F') ? `1${faculty_id.substring(1)}` : faculty_id;

      // Generate SEM_ID
      const semId = `${semester}${branchValue}${divisionValue}${batchValue}${subject_id}`;

      // Insert or update the record in the sem_info table
      await db('sem_info')
        .insert({
          SEMESTER: semester,
          BRANCH: branch,
          DIVISION: division,
          BATCH: batch,
          SUB_ID: subject_id,
          FACULTY_ID: numericFacultyId, // Use numericFacultyId here
          SEM_ID: parseInt(semId, 10), // Convert SEM_ID to integer
        })
        .onConflict('SEM_ID') // Handle conflicts on the primary key
        .merge(); // Merge the new values with existing ones

      console.log(`Inserted/Updated subject ${subject_id} with faculty ${numericFacultyId}`);
    }

    // Send a success response
    res.status(200).json({ message: 'Subjects updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};