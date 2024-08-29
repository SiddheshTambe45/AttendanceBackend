import db from '../db/knexfile.js';

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


export const saveDivisionData = async (req, res) => {
    try {
        const data = req.body;

        if (!Array.isArray(data) || data.length === 0) {
            return res.status(400).json({ error: 'Invalid data format or empty array' });
        }

        // Begin transaction
        await db.transaction(async trx => {
            for (const branchData of data) {
                const { name, divisionNames, divisions } = branchData;

                if (!name || !divisionNames || !Array.isArray(divisionNames) || !divisions) {
                    throw new Error('Branch name, division names, and number of divisions are required');
                }

                // Check existing divisions for the branch and semester
                const existingDivisions = await trx('temp_sem_info')
                    .where({ BRANCH: name, SEMESTER: 1 })
                    .select('DIVISION');

                const existingDivisionNames = existingDivisions.map(d => d.DIVISION);

                // Determine new and removed divisions
                const newDivisions = divisionNames.filter(name => !existingDivisionNames.includes(name));
                const removedDivisions = existingDivisionNames.filter(name => !divisionNames.includes(name));

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
