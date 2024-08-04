import db from '../db/knexfile.js';



export const getCriteria = async (req, res) => {
  try {
    const { branch } = req.query; // Extract branch from query parameters

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



export const getSemestersAndDivisions = async (req, res) => {
  const { department } = req.query; // Get department from the request query

  try {
    // Fetch data from temp_sem_info table
    const tempSemInfo = await db('temp_sem_info')
      .select('SEMESTER', 'DIVISION')
      .where('BRANCH', department)
      .andWhere('FINALIZED', false); // Filter out finalized entries

    // Aggregate the data
    const semesters = new Set();
    const divisions = {};

    tempSemInfo.forEach(row => {
      semesters.add(row.SEMESTER);

      if (!divisions[row.SEMESTER]) {
        divisions[row.SEMESTER] = [];
      }
      if (!divisions[row.SEMESTER].includes(row.DIVISION)) {
        divisions[row.SEMESTER].push(row.DIVISION);
      }
    });

    // Prepare response data
    const responseData = {
      semesters: Array.from(semesters),
      divisions
    };

    // Send response
    res.status(200).json(responseData);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const addStudents = async (req, res) => {
  const { criteria, students } = req.body; // Get criteria and students from the request body

  // console.log(criteria , students)

  const { semester, division, department } = criteria;

  // Start a transaction
  const trx = await db.transaction();

  try {
    // Insert students data into the student_info table within the transaction
    for (const student of students) {
      const { name, prn, batch, dlo } = student;

      await trx('student_info').insert({
        PRN: prn,
        NAME: name,
        SEMESTER: parseInt(semester),
        BRANCH: department,
        DIVISION: division,
        BATCH: batch,
        DLO: dlo
      });
    }

    // Commit the transaction
    await trx.commit();

    // Send a successful response
    res.status(200).json({ message: 'Students added successfully' });

  } catch (error) {
    // Rollback the transaction in case of an error
    await trx.rollback();

    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// --------------------------------- academic sturcture

export const saveTempSemInfo = async (req, res) => {
  const data = req.body; // Expecting the data from the frontend in the specified format

  try {
    // Preprocessing step
    const tempSemInfoEntries = [];

    data.forEach(entry => {
      const { semester, branch, divisions, batches } = entry;

      divisions.forEach(division => {
        batches[division].forEach(batch => {
          const tempSemId = `${semester}-${branch}-${division}-${batch}`;
          tempSemInfoEntries.push({
            SEMESTER: semester,
            BRANCH: branch,
            DIVISION: division,
            BATCH: batch,
            TEMP_SEM_ID: tempSemId
          });
        });
      });
    });

    // Begin transaction
    await db.transaction(async trx => {
      // Insert all entries into temp_sem_info
      await trx('temp_sem_info').insert(tempSemInfoEntries);

      // Optionally, you can finalize or process the data further here

      // Commit transaction
      await trx.commit();
    });

    // Send response
    res.status(200).json({ message: 'Temp semester info saved successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// -------------------------

export const getCriteriaFacSub = async (req, res) => {
  const { department } = req.query; // Get department from the request query

  try {
    // Step 1: Fetch data from temp_sem_info table
    const tempSemInfo = await db('temp_sem_info')
      .select('SEMESTER', 'DIVISION', 'BATCH')
      .where('BRANCH', department);

    // Aggregate the data
    const semesters = new Set();
    const divisions = {};
    const batches = {};

    tempSemInfo.forEach(row => {
      semesters.add(row.SEMESTER);

      if (!divisions[row.SEMESTER]) {
        divisions[row.SEMESTER] = [];
      }
      if (!divisions[row.SEMESTER].includes(row.DIVISION)) {
        divisions[row.SEMESTER].push(row.DIVISION);
      }

      if (!batches[row.SEMESTER]) {
        batches[row.SEMESTER] = {};
      }
      if (!batches[row.SEMESTER][row.DIVISION]) {
        batches[row.SEMESTER][row.DIVISION] = [];
      }
      if (!batches[row.SEMESTER][row.DIVISION].includes(row.BATCH)) {
        batches[row.SEMESTER][row.DIVISION].push(row.BATCH);
      }
    });

    // Step 2: Prepare response data
    const responseData = {
      semesters: Array.from(semesters),
      divisions,
      batches
    };

    // Step 3: Send response
    res.status(200).json(responseData);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



export const getSubjectsAndFaculty = async (req, res) => {
  const { semester, branch, division } = req.query;

  try {
    // Step 1: Fetch assigned subjects
    const assignedSubjects = await db('sem_info')
      .select('subject.SUBJECT_ID', 'subject.SUBJECT_NAME', 'subject.TYPE', 'subject.SEMESTER', 'sem_info.DIVISION', 'sem_info.BATCH', 'sem_info.FACULTY_ID')
      .innerJoin('subject', 'sem_info.SUBJECT_ID', 'subject.SUBJECT_ID')
      .where('sem_info.BRANCH', branch)
      .andWhere('sem_info.SEMESTER', semester)
      .andWhere('sem_info.DIVISION', division);

    // Step 2: Fetch unassigned subjects
    const assignedSubjectIds = assignedSubjects.map(subject => subject.SUBJECT_ID);

    const unassignedSubjects = await db('subject')
      .select('SUBJECT_ID', 'SUBJECT_NAME', 'TYPE', 'SEMESTER', 'BRANCH')
      .where('BRANCH', branch)
      .andWhere('SEMESTER', semester)
      .whereNotIn('SUBJECT_ID', assignedSubjectIds);

    // Format unassigned subjects with empty faculty ID, division, and batch
    const unassignedSubjectsFormatted = unassignedSubjects.map(subject => ({
      ...subject,
      FACULTY_ID: '',  // No faculty assigned yet
      DIVISION: '',    // No division assigned yet
      BATCH: ''        // No batch assigned yet
    }));

    // Step 3: Fetch faculty details for the branch
    const facultyDetails = await db('faculty')
      .select('FACULTY_NAME', 'FACULTY_ID', 'DEPARTMENT')
      .where('DEPARTMENT', branch);

    // Step 4: Fetch all departments
    const allDepartments = await db('faculty')
      .distinct('DEPARTMENT');

    // Prepare the response data
    const responseData = {
      faculty: facultyDetails,
      subjects: [...assignedSubjects, ...unassignedSubjectsFormatted],
      allDepartments: allDepartments.map(dep => dep.DEPARTMENT)
    };

    // Send the response
    res.status(200).send(responseData);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




export const getFacultyByDepartment = async (req, res) => {
  const { department } = req.query; // Get department from the request query

  try {
    // Fetch faculty details for the specified department
    const facultyDetails = await db('faculty')
      .select('FACULTY_NAME', 'FACULTY_ID', 'DEPARTMENT')
      .where('DEPARTMENT', department);

    // Send the response
    res.status(200).json(facultyDetails);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




export const allocateFacultyToSubject = async (req, res) => {
  const allocations = req.body; // Get the array of allocations from the request body

  try {
    // Prepare data for insertion
    const validSemInfos = [];
    const subjectsToInsert = [];
    const semInfoInserts = [];
    const validSubjectTypes = ['T', 'P']; // Valid types for the ENUM

    for (const allocation of allocations) {
      const { semester, branch, division, batch, subject_id, faculty_id, new: isNew, subject_name, subject_type } = allocation;

      // Validate subject type
      if (!validSubjectTypes.includes(subject_type)) {
        return res.status(400).json({ message: `Invalid subject type: ${subject_type}. Valid types are ${validSubjectTypes.join(', ')}` });
      }

      // Step 1: Check if the semester, branch, division, and batch are present in temp_sem_info
      const validSemInfo = await db('temp_sem_info')
        .where({
          SEMESTER: semester,
          BRANCH: branch,
          DIVISION: division,
          BATCH: batch
        })
        .first();

      if (!validSemInfo) {
        return res.status(400).json({ message: `Invalid combination of semester, branch, division, and batch: ${semester}, ${branch}, ${division}, ${batch}` });
      }
      validSemInfos.push(validSemInfo);

      // Step 2: Check if faculty_id is present in faculty table
      const validFaculty = await db('faculty')
        .where('FACULTY_ID', faculty_id)
        .first();

      if (!validFaculty) {
        return res.status(400).json({ message: `Invalid faculty ID: ${faculty_id}` });
      }

      // Step 3: Check if the subject exists in the subject table
      const existingSubject = await db('subject')
        .where('SUBJECT_ID', subject_id)
        .first();

      if (isNew === 'yes') {
        // Add the new subject if it does not exist
        if (!existingSubject) {
          subjectsToInsert.push({
            SUBJECT_ID: subject_id,
            SUBJECT_NAME: subject_name,
            BRANCH: branch,
            SEMESTER: semester,
            TYPE: subject_type // Correctly use 'T' or 'P'
          });
        }
        // If the subject already exists, do nothing
      } else {
        // Check if the subject exists if it is not new
        if (!existingSubject) {
          return res.status(400).json({ message: `Invalid subject ID: ${subject_id}` });
        }
      }

      // Step 4: Form the new sem_id
      const sem_id = `${semester}_${branch}_${division}_${batch}_${subject_id}_${faculty_id}`;

      // Prepare data for sem_info table insertion
      semInfoInserts.push({
        SEMESTER: semester,
        BRANCH: branch,
        DIVISION: division,
        BATCH: batch,
        SUBJECT_ID: subject_id,
        FACULTY_ID: faculty_id,
        SEM_ID: sem_id
      });
    }

    // Start a transaction for inserting data
    await db.transaction(async trx => {
      // Insert new subjects if any
      if (subjectsToInsert.length > 0) {
        await trx('subject').insert(subjectsToInsert);
      }

      // Insert data into sem_info
      if (semInfoInserts.length > 0) {
        await trx('sem_info').insert(semInfoInserts);
      }

      // Commit the transaction
      await trx.commit();
      res.status(200).json({ message: 'Allocations made permanent successfully' });
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

