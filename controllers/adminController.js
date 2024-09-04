import db from '../db/knexfile.js';

/*
export const getDivisionData = async (req, res) => {
    try {
        // Fetch all branches
        const branches = await db('department').select('BRANCH', 'GENERIC_BRANCH');
        
        // Fetch branch mappings
        const branchMappings = await db('branch_mapping').select('GENERIC_BRANCH', 'SPECIFIC_BRANCH');
        
        // Prepare an array to hold branch details
        const branchDetails = [];

        for (const branch of branches) {
            let specificBranches = [];
            let genericBranch = branch.GENERIC_BRANCH && branch.GENERIC_BRANCH !== branch.BRANCH ? branch.GENERIC_BRANCH : null;

            if (branch.BRANCH === 'FIRST_YEAR') {
                // For FIRST_YEAR, find all specific branches
                specificBranches = branchMappings
                    .filter(mapping => mapping.GENERIC_BRANCH === branch.BRANCH)
                    .map(mapping => mapping.SPECIFIC_BRANCH);
            } else if (genericBranch) {
                // If the branch is a generic branch, get its specific branches
                specificBranches = branchMappings
                    .filter(mapping => mapping.GENERIC_BRANCH === branch.BRANCH)
                    .map(mapping => mapping.SPECIFIC_BRANCH);
            } else {
                // If the branch is not generic, it is specific by itself
                specificBranches = [branch.BRANCH];
            }

            // Fetch division data for all specific branches
            const divisions = await db('temp_sem_info')
                .whereIn('BRANCH', specificBranches)
                .andWhere('SEMESTER', 1) // Assuming you are looking for semester 1
                .select('DIVISION');

            // Extract unique division names into an array
            const divisionNames = [...new Set(divisions.map(d => d.DIVISION))];
            const intake = divisionNames.length * 60; // Calculate intake based on the number of divisions

            branchDetails.push({
                name: branch.BRANCH,
                genericName: genericBranch,
                intake: intake,
                divisions: divisionNames.length,
                divisionNames: divisionNames,
            });
        }

        res.json(branchDetails);
    } catch (error) {
        console.error('Error fetching division data:', error);
        res.status(500).json({ error: 'An error occurred while fetching division data' });
    }
};
*/

/*
export const getDivisionData = async (req, res) => {
    try {
        // Fetch all branches
        const branches = await db('department').select('BRANCH', 'GENERIC_BRANCH');
        
        // Fetch branch mappings
        const branchMappings = await db('branch_mapping').select('GENERIC_BRANCH', 'SPECIFIC_BRANCH');
        
        // Prepare an array to hold branch details
        const branchDetails = [];

        for (const branch of branches) {
            if (branch.BRANCH === 'FIRST_YEAR') {
                // For FIRST_YEAR, find all specific branches
                const specificBranches = branchMappings
                    .filter(mapping => mapping.GENERIC_BRANCH === 'FIRST_YEAR')
                    .map(mapping => mapping.SPECIFIC_BRANCH);

                // Fetch and send data for each specific branch under FIRST_YEAR
                for (const specificBranch of specificBranches) {
                    const divisions = await db('temp_sem_info')
                        .where({ BRANCH: specificBranch, SEMESTER: 1 })
                        .select('DIVISION');
                    
                    const divisionNames = [...new Set(divisions.map(d => d.DIVISION))];
                    const intake = divisionNames.length * 60;

                    branchDetails.push({
                        name: specificBranch,            // Specific branch name
                        genericName: 'FIRST_YEAR',      // Generic branch name
                        intake: intake,
                        divisions: divisionNames.length,
                        divisionNames: divisionNames,
                    });
                }
            } else if (branch.GENERIC_BRANCH) {
                // For other branches that have a generic branch
                const divisions = await db('temp_sem_info')
                    .where({ BRANCH: branch.BRANCH, SEMESTER: 1 })
                    .select('DIVISION');

                const divisionNames = [...new Set(divisions.map(d => d.DIVISION))];
                const intake = divisionNames.length * 60;

                branchDetails.push({
                    name: branch.BRANCH,                 // Specific branch name
                    genericName: branch.GENERIC_BRANCH,  // Generic branch name
                    intake: intake,
                    divisions: divisionNames.length,
                    divisionNames: divisionNames,
                });
            } else {
                // For branches that are specific and have no generic branch
                const divisions = await db('temp_sem_info')
                    .where({ BRANCH: branch.BRANCH, SEMESTER: 1 })
                    .select('DIVISION');

                const divisionNames = [...new Set(divisions.map(d => d.DIVISION))];
                const intake = divisionNames.length * 60;

                branchDetails.push({
                    name: branch.BRANCH,       // Specific branch name
                    genericName: null,         // No generic branch
                    intake: intake,
                    divisions: divisionNames.length,
                    divisionNames: divisionNames,
                });
            }
        }

        res.json(branchDetails);
    } catch (error) {
        console.error('Error fetching division data:', error);
        res.status(500).json({ error: 'An error occurred while fetching division data' });
    }
};
*/

/* /*
export const getDivisionData = async (req, res) => {
    try {
        // Fetch all branches with the generic branch information
        const branches = await db('department').select('BRANCH', 'GENERIC_BRANCH');

        // Fetch branch mappings
        const branchMappings = await db('branch_mapping').select('GENERIC_BRANCH', 'SPECIFIC_BRANCH');

        // Prepare an array to hold branch details
        const branchDetails = [];

        // Filter branches where GENERIC_BRANCH is true
        const firstYearBranches = branches.filter(branch => branch.GENERIC_BRANCH);

        // For each branch that is a generic branch
        for (const branch of firstYearBranches) {
            // Find all specific branches mapped to the 'FIRST_YEAR' generic branch
            const specificBranches = branchMappings
                .filter(mapping => mapping.GENERIC_BRANCH === branch.BRANCH)
                .map(mapping => mapping.SPECIFIC_BRANCH);

            // Fetch and send data for each specific branch under FIRST_YEAR
            for (const specificBranch of specificBranches) {
                const divisions = await db('temp_sem_info')
                    .where({ BRANCH: specificBranch, SEMESTER: 1 })
                    .select('DIVISION');

                const divisionNames = [...new Set(divisions.map(d => d.DIVISION))];
                const intake = divisionNames.length * 60;

                branchDetails.push({
                    name: specificBranch,            // Specific branch name
                    genericName: 'FIRST_YEAR',      // Generic branch name
                    intake: intake,
                    divisions: divisionNames.length,
                    divisionNames: divisionNames,
                });
            }
        }

        res.json(branchDetails);
        console.log(branchDetails)
    } catch (error) {
        console.error('Error fetching division data:', error);
        res.status(500).json({ error: 'An error occurred while fetching division data' });
    }
};
*/

/*
export const saveDivisionData = async (req, res) => {
    try {
        const data = req.body;
        console.log('Received data:', data); // Log received data

        if (!Array.isArray(data) || data.length === 0) {
            return res.status(400).json({ error: 'Invalid data format or empty array' });
        }

        // Filter out invalid entries
        const validData = data.filter(entry => entry.name && Array.isArray(entry.divisionNames) && entry.divisions);
        console.log('Valid data:', validData); // Log valid data

        // Begin transaction
        await db.transaction(async trx => {
            for (const branchData of validData) {
                console.log('Processing branchData:', branchData);
                const { name, divisionNames, divisions } = branchData;

                // Check existing divisions for the branch and semester
                const existingDivisions = await trx('temp_sem_info')
                    .where({ BRANCH: name, SEMESTER: 1 })
                    .select('DIVISION');

                const existingDivisionNames = existingDivisions.map(d => d.DIVISION);

                console.log("EDN:",existingDivisionNames)

                // Determine new and removed divisions
                const newDivisions = divisionNames.filter(div => !existingDivisionNames.includes(div));
                const removedDivisions = existingDivisionNames.filter(div => !divisionNames.includes(div));

                console.log(newDivisions,'',newDivisions)

                // Handle new divisions
                for (const divName of newDivisions) {
                    const baseTempSemId = `${name}_1_${divName}`;

                    // Insert new divisions
                    await trx('temp_sem_info').insert({
                        SEMESTER: 1,
                        BRANCH: name,
                        DIVISION: divName,
                        BATCH: 'B1', // Example batch; adjust if needed
                        TEMP_SEM_ID: `${baseTempSemId}_B1`,
                        FINALIZED: false
                    });

                    // Create batches for the new divisions
                    for (let batchIndex = 1; batchIndex <= 3; batchIndex++) {
                        const batchId = `${divName}${batchIndex}`; // Example batch IDs: A1, A2, A3
                        await trx('temp_sem_info').insert({
                            SEMESTER: 1,
                            BRANCH: name,
                            DIVISION: divName,
                            BATCH: batchId,
                            TEMP_SEM_ID: `${baseTempSemId}_${batchId}`,
                            FINALIZED: false
                        });
                    }
                }

                // Handle removed divisions
                for (const divName of removedDivisions) {
                    await trx('temp_sem_info')
                        .where({ BRANCH: name, DIVISION: divName, SEMESTER: 1 })
                        .del();
                }
            }

            // Commit transaction
            await trx.commit();
        });

        res.status(200).json({ message: 'Division data saved successfully' });
    } catch (error) {
        console.error('Error saving division data:', error);
        res.status(500).json({ error: 'An error occurred while saving division data' });
    }
};
*/

/* /*
export const saveDivisionData = async (req, res) => {
    try {
        const data = req.body;
        console.log('Received data:', data); // Log received data

        if (!Array.isArray(data) || data.length === 0) {
            return res.status(400).json({ error: 'Invalid data format or empty array' });
        }

        // Filter out invalid entries
        const validData = data.filter(entry => entry.name && Array.isArray(entry.divisionNames) && entry.divisions);
        console.log('Valid data:', validData); // Log valid data

        // Begin transaction
        await db.transaction(async trx => {
            for (const branchData of validData) {
                console.log('Processing branchData:', branchData);
                const { name, divisionNames, divisions } = branchData;

                // Check existing divisions for the branch and semester
                const existingDivisions = await trx('temp_sem_info')
                    .where({ BRANCH: name, SEMESTER: 1 })
                    .select('DIVISION');
                console.log('Existing divisions:', existingDivisions);

                const existingDivisionNames = existingDivisions.map(d => d.DIVISION);
                console.log('Existing division names:', existingDivisionNames);

                // Compute new and removed divisions
                const newDivisions = divisionNames.filter(div => !existingDivisionNames.includes(div));
                const removedDivisions = existingDivisionNames.filter(div => !divisionNames.includes(div));
                console.log('New divisions:', newDivisions);
                console.log('Removed divisions:', removedDivisions);

                // Handle new divisions
                for (const divName of newDivisions) {
                    const baseTempSemId = `${name}_1_${divName}`;

                    // Insert the main division record if it does not already exist
                    const existingRecord = await trx('temp_sem_info')
                        .where({ SEMESTER: 1, BRANCH: name, DIVISION: divName })
                        .first();
                    console.log('Existing record for new division:', existingRecord);

                    if (!existingRecord) {
                        await trx('temp_sem_info').insert({
                            SEMESTER: 1,
                            BRANCH: name,
                            DIVISION: divName,
                            BATCH: 'B1', // Insert one batch initially
                            TEMP_SEM_ID: `${baseTempSemId}_B1`,
                            FINALIZED: true // Set to true
                        });
                        console.log(`Inserted main division record: ${baseTempSemId}_B1`);
                    }

                    // Create batches for the new divisions
                    for (let batchIndex = 1; batchIndex <= 3; batchIndex++) {
                        const batchId = `${divName}${batchIndex}`; // Example batch IDs: A1, A2, A3
                        const tempSemId = `${baseTempSemId}_${batchId}`;
                        console.log('Checking batch record:', tempSemId);

                        // Check if the batch record already exists before inserting
                        const existingBatchRecord = await trx('temp_sem_info')
                            .where({ TEMP_SEM_ID: tempSemId })
                            .first();
                        console.log('Existing batch record:', existingBatchRecord);

                        if (!existingBatchRecord) {
                            await trx('temp_sem_info').insert({
                                SEMESTER: 1,
                                BRANCH: name,
                                DIVISION: divName,
                                BATCH: batchId,
                                TEMP_SEM_ID: tempSemId,
                                FINALIZED: true // Set to true
                            });
                            console.log(`Inserted batch record: ${tempSemId}`);
                        }
                    }
                }

                // Handle removed divisions
                for (const divName of removedDivisions) {
                    console.log('Deleting removed division:', divName);
                    await trx('temp_sem_info')
                        .where({ BRANCH: name, DIVISION: divName, SEMESTER: 1 })
                        .del();
                }
            }

            // Commit transaction
            await trx.commit();
            console.log('Transaction committed');
        });

        res.status(200).json({ message: 'Division data saved successfully' });
    } catch (error) {
        console.error('Error saving division data:', error);
        res.status(500).json({ error: 'An error occurred while saving division data' });
    }
};
*/ 

export const getDivisionData = async (req, res) => {
    try {
        const branches = await db('department').select('BRANCH', 'GENERIC_BRANCH');
        const branchMappings = await db('branch_mapping').select('GENERIC_BRANCH', 'SPECIFIC_BRANCH');
        const branchDetails = [];

        const firstYearBranches = branches.filter(branch => branch.GENERIC_BRANCH);

        for (const branch of firstYearBranches) {
            const specificBranches = branchMappings
                .filter(mapping => mapping.GENERIC_BRANCH === branch.BRANCH)
                .map(mapping => mapping.SPECIFIC_BRANCH);

            for (const specificBranch of specificBranches) {
                const divisions = await db('temp_sem_info')
                    .where({ BRANCH: specificBranch, SEMESTER: 1 })
                    .select('DIVISION', 'FINALIZED'); // Include FINALIZED in selection

                const divisionNames = [...new Set(divisions.map(d => d.DIVISION))];
                const intake = divisionNames.length * 60;

                branchDetails.push({
                    name: specificBranch,
                    genericName: 'FIRST_YEAR',
                    intake: intake,
                    divisions: divisionNames.length,
                    divisionNames: divisionNames,
                    finalized: divisions.length > 0 ? divisions[0].FINALIZED : false // Set finalized based on first division
                });
            }
        }

        res.json(branchDetails);
        console.log(branchDetails);
    } catch (error) {
        console.error('Error fetching division data:', error);
        res.status(500).json({ error: 'An error occurred while fetching division data' });
    }
};

/* /*
export const saveDivisionData = async (req, res) => {
    try {
        const data = req.body;
        console.log('Received data:', data); // Log received data

        if (!Array.isArray(data) || data.length === 0) {
            return res.status(400).json({ error: 'Invalid data format or empty array' });
        }

        // Filter out invalid entries
        const validData = data.filter(entry => entry.name && Array.isArray(entry.divisionNames) && entry.divisions);
        console.log('Valid data:', validData); // Log valid data

        // Begin transaction
        await db.transaction(async trx => {
            for (const branchData of validData) {
                console.log('Processing branchData:', branchData);
                const { name, divisionNames, divisions, finalized } = branchData;

                // Check existing divisions for the branch and semester
                const existingDivisions = await trx('temp_sem_info')
                    .where({ BRANCH: name, SEMESTER: 1 })
                    .select('DIVISION');
                console.log('Existing divisions:', existingDivisions);

                const existingDivisionNames = existingDivisions.map(d => d.DIVISION);
                console.log('Existing division names:', existingDivisionNames);

                // Compute new and removed divisions
                const newDivisions = divisionNames.filter(div => !existingDivisionNames.includes(div));
                const removedDivisions = existingDivisionNames.filter(div => !divisionNames.includes(div));
                console.log('New divisions:', newDivisions);
                console.log('Removed divisions:', removedDivisions);

                // Handle new divisions and batches in a single step
                for (const divName of newDivisions) {
                    for (let batchIndex = 1; batchIndex <= 3; batchIndex++) {
                        const batchId = `B${batchIndex}`;
                        const tempSemId = `${name}_1_${divName}_${batchId}`;

                        await trx('temp_sem_info')
                            .insert({
                                SEMESTER: 1,
                                BRANCH: name,
                                DIVISION: divName,
                                BATCH: batchId,
                                TEMP_SEM_ID: tempSemId,
                                FINALIZED: finalized || false // Save finalized status
                            })
                            .onConflict(['SEMESTER', 'BRANCH', 'DIVISION', 'BATCH'])
                            .merge(); // Update if exists
                        console.log(`Inserted or updated batch: ${tempSemId}`);
                    }
                }

                // Handle removed divisions
                for (const divName of removedDivisions) {
                    console.log('Deleting removed division:', divName);
                    await trx('temp_sem_info')
                        .where({ BRANCH: name, DIVISION: divName, SEMESTER: 1 })
                        .del();
                }
            }

            // Commit transaction
            await trx.commit();
            console.log('Transaction committed');
        });

        res.status(200).json({ message: 'Division data saved successfully' });
    } catch (error) {
        console.error('Error saving division data:', error);
        res.status(500).json({ error: 'An error occurred while saving division data' });
    }
};
*/

export const saveDivisionData = async (req, res) => {
    try {
        const data = req.body;
        console.log('Received data:', data);

        if (!Array.isArray(data) || data.length === 0) {
            return res.status(400).json({ error: 'Invalid data format or empty array' });
        }

        const validData = data.filter(entry => entry.name && Array.isArray(entry.divisionNames) && entry.divisions);
        console.log('Valid data:', validData);

        await db.transaction(async trx => {
            for (const branchData of validData) {
                console.log('Processing branchData:', branchData);
                const { name, divisionNames, divisions, finalized } = branchData;

                const existingDivisions = await trx('temp_sem_info')
                    .where({ BRANCH: name, SEMESTER: 1 })
                    .select('DIVISION');
                console.log('Existing divisions:', existingDivisions);

                const existingDivisionNames = existingDivisions.map(d => d.DIVISION);
                console.log('Existing division names:', existingDivisionNames);

                const newDivisions = divisionNames.filter(div => !existingDivisionNames.includes(div));
                const removedDivisions = existingDivisionNames.filter(div => !divisionNames.includes(div));
                console.log('New divisions:', newDivisions);
                console.log('Removed divisions:', removedDivisions);

                for (const divName of newDivisions) {
                    for (let batchIndex = 1; batchIndex <= 3; batchIndex++) {
                        const batchId = `${divName}${batchIndex}`;
                        const tempSemId = `1_${name}_${divName}_${batchId}`;

                        await trx('temp_sem_info')
                            .insert({
                                SEMESTER: 1,
                                BRANCH: name,
                                DIVISION: divName,
                                BATCH: batchId,
                                TEMP_SEM_ID: tempSemId,
                                FINALIZED: finalized || false
                            })
                            .onConflict(['SEMESTER', 'BRANCH', 'DIVISION', 'BATCH'])
                            .merge();
                        console.log(`Inserted or updated batch: ${tempSemId}`);
                    }
                }

                for (const divName of removedDivisions) {
                    console.log('Deleting removed division:', divName);
                    await trx('temp_sem_info')
                        .where({ BRANCH: name, DIVISION: divName, SEMESTER: 1 })
                        .del();
                }
            }

            await trx.commit();
            console.log('Transaction committed');
        });

        res.status(200).json({ message: 'Division data saved successfully' });
    } catch (error) {
        console.error('Error saving division data:', error);
        res.status(500).json({ error: 'An error occurred while saving division data' });
    }
};


/*
export const getBranchDivisionSemesterData = async (req, res) => {
    try {
        // Fetch distinct branch, division, and semester combinations from temp_sem_info
        const data = await db('temp_sem_info')
            .distinct('BRANCH', 'DIVISION')
            .select();

        // Prepare the response object
        const response = {};

        data.forEach(item => {
            if (!response[item.BRANCH]) {
                response[item.BRANCH] = [];
            }
            if (!response[item.BRANCH].includes(item.DIVISION)) {
                response[item.BRANCH].push(item.DIVISION);
            }
        });

        // Convert response object to an array of objects
        const responseArray = Object.keys(response).map(branch => ({
            branch,
            division: response[branch]
        }));

        res.json(responseArray);
    } catch (error) {
        console.error('Error fetching branch, division, and semester data:', error);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
};
*/

export const getBranchDivisionSemesterData = async (req, res) => {
    try {
        // Fetch distinct branch, division, and semester combinations from temp_sem_info where FINALIZED is true
        const data = await db('temp_sem_info')
            .distinct('BRANCH', 'DIVISION')
            .where({ FINALIZED: true })  // Add this condition to filter by FINALIZED
            .select();

        // Prepare the response object
        const response = {};

        data.forEach(item => {
            if (!response[item.BRANCH]) {
                response[item.BRANCH] = [];
            }
            if (!response[item.BRANCH].includes(item.DIVISION)) {
                response[item.BRANCH].push(item.DIVISION);
            }
        });

        // Convert response object to an array of objects
        const responseArray = Object.keys(response).map(branch => ({
            branch,
            division: response[branch]
        }));

        res.json(responseArray);
    } catch (error) {
        console.error('Error fetching branch, division, and semester data:', error);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
};


export const addStudents = async (req, res) => {
    const { branch, division, semester, students } = req.body;

    try {
        // Check if all students are new entries
        for (const student of students) {
            const existingStudent = await db('student_info')
                .where({ PRN: student.PRN })
                .first();
            if (existingStudent) {
                return res.status(400).json({
                    error: `Student with PRN ${student.PRN} already exists.`,
                });
            }
        }

        // Begin transaction to add new students
        await db.transaction(async (trx) => {
            for (const student of students) {
                await trx('student_info').insert({
                    PRN: student.PRN,
                    NAME: student.Name,
                    SEMESTER: semester,
                    BRANCH: branch,
                    DIVISION: division,
                    BATCH: student.Batch,
                    DLO: semester === 1 ? null : student.DLO,
                });
            }
        });

        res.status(200).json({ message: 'Students added successfully.' });
    } catch (error) {
        console.error('Error adding students:', error);
        res.status(500).json({ error: 'Failed to add students.' });
    }
};
