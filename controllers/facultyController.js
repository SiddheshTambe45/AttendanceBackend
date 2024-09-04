import db from '../db/knexfile.js';



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


/*
export const getParticularData = async (req, res) => {
  // try {
  //   const { sem, branch, batch, div, sub_id } = req.query; // Extract input parameters from the request body

  //   console.log(sem, branch, batch, div, sub_id);

  //   // Step 1: Retrieve the list of students based on the provided criteria
  //   let studentsQuery = db('student_info')
  //     .select('PRN', 'NAME')
  //     .where({ SEMESTER: sem, BRANCH: branch, DIVISION: div });

  //   if (batch) {
  //     // Filter by batch if provided
  //     studentsQuery = studentsQuery.where({ BATCH: batch });
  //   }

  //   const students = await studentsQuery;

  //   if (students.length === 0) {
  //     return res.status(404).json({ message: 'No students found for the specified criteria' });
  //   }

  //   // Step 2: Retrieve the sem_id for the specified criteria
  //   let infoTableQuery = db('sem_info')
  //     .select('SEM_ID')
  //     .where({ SEMESTER: sem, BRANCH: branch, DIVISION: div, SUBJECT_ID: sub_id });

  //   if (!batch) {
  //     // If batch is not provided, include all batches in the query
  //     infoTableQuery = db('sem_info')
  //       .select('SEM_ID')
  //       .where({ SEMESTER: sem, BRANCH: branch, DIVISION: div, SUBJECT_ID: sub_id });
  //   } else {
  //     // If batch is provided, include it in the query
  //     infoTableQuery = infoTableQuery.where({ BATCH: batch });
  //   }

  //   const infoTableResults = await infoTableQuery;

  //   if (infoTableResults.length === 0) {
  //     return res.status(404).json({ message: 'No sem_id found for the specified criteria' });
  //   }

  //   const semIds = infoTableResults.map(row => row.SEM_ID);

  //   // Step 3: Retrieve attendance data based on the retrieved sem_id
  //   const attendanceQuery = await db('attendance_table')
  //     .select('DATE', 'STUDENTS')
  //     .whereIn('SEM_ID', semIds);

  //   if (attendanceQuery.length === 0) {
  //     return res.status(404).json({ message: 'No attendance data found for the specified criteria' });
  //   }

  //   // Step 4: Correlate attendance data with the list of students
  //   const attendanceData = students.map(student => {
  //     const lectures = [];
  //     const dates = [];

  //     attendanceQuery.forEach(record => {
  //       dates.push(record.DATE.toISOString().split('T')[0]); // Format date as 'yyyy-mm-dd'
  //       lectures.push(record.STUDENTS.includes(student.PRN) ? 1 : 0);
  //     });

  //     return {
  //       prn: student.PRN,
  //       name: student.NAME,
  //       lectures,
  //       dates
  //     };
  //   });

  //   // Step 5: Send the response back to the client
  //   res.status(200).json({ attendanceData });

  // } catch (error) {
  //   console.error('Error fetching attendance data:', error);
  //   res.status(500).send({ error: 'Internal Server Error' });
  // }

  try {
    const { sem, branch, batch, div, sub_id } = req.query; // Extract input parameters from the request query

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

    if (batch) {
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
      .select('DATE', 'STUDENTS', 'SEM_ID') // Select only available columns
      .whereIn('SEM_ID', semIds)
      .andWhere('DATE', '<=', db.fn.now())
      .orderBy('DATE', 'desc');

    if (attendanceQuery.length === 0) {
      return res.status(404).json({ message: 'No attendance data found for the specified criteria' });
    }

    // Step 4: Correlate attendance data with the list of students
    const attendanceData = students.map(student => {
      const lectures = [];
      const dates = [];

      attendanceQuery.forEach(record => {
        dates.push(record.DATE); //.toISOString().split('T')[0] // Format date as 'yyyy-mm-dd' 
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
*/

export const updateAttendanceData = async (req, res) => {
  try {
    const { semester, branch, division, subject, faculty_id, attendance } = req.body;

    console.log( req.body )

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



/*
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
*/

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

    if (attendanceData.length === 0) {
      // When no attendance records are found but students are present
      const response = {
        attendance: [{
          date: null,
          semId: semIds[0], // Assuming there is at least one SEM_ID
          students: students.map(student => ({
            name: student.NAME,
            prn: student.PRN,
            attendance: 0 // Indicating no attendance records
          }))
        }]
      };
      return res.status(200).json(response);
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

export const getParticularData = async (req, res) => {
  try {
    const { sem, branch, batch, div, sub_id } = req.query; // Extract input parameters from the request query

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

    if (batch) {
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
      .select('DATE', 'STUDENTS', 'SEM_ID') // Select only available columns
      .whereIn('SEM_ID', semIds)
      .andWhere('DATE', '<=', db.fn.now())
      .orderBy('DATE', 'desc');

    if (attendanceQuery.length === 0) {
      // If no attendance data is found, return students with null dates and lectures
      const attendanceData = students.map(student => ({
        prn: student.PRN,
        name: student.NAME,
        lectures: null,
        dates: null
      }));

      return res.status(200).json({ attendanceData });
    }

    // Step 4: Correlate attendance data with the list of students
    const attendanceData = students.map(student => {
      const lectures = [];
      const dates = [];

      attendanceQuery.forEach(record => {
        dates.push(record.DATE); // No formatting as per your request
        lectures.push(record.STUDENTS.includes(student.PRN) ? 1 : 0);
      });

      // If no lectures or dates were added, set them to null
      return {
        prn: student.PRN,
        name: student.NAME,
        lectures: lectures.length ? lectures : null,
        dates: dates.length ? dates : null
      };
    });

    // Step 5: Send the response back to the client
    res.status(200).json({ attendanceData });

  } catch (error) {
    console.error('Error fetching attendance data:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
}
