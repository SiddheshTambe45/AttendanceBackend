// import db from '../db/knexfile.js';
// import bcrypt from 'bcryptjs'; // Use bcryptjs instead of bcrypt

// // Function to fetch departments
// export const getDepartments = async (req, res) => {
//     try {
//       // Query the department table
//       const departments = await db('department').select('BRANCH');
  
//       // Send response with the list of departments
//       res.status(200).json(departments.map(dept => dept.BRANCH));
//     } catch (error) {
//       console.error('Error fetching departments:', error);
//       res.status(500).json({ message: 'Failed to fetch departments' });
//     }
// };


// // Add a faculty member //signup
// export const addFaculty = async (req, res) => {
//   const { facultyId, facultyName, department, password, email } = req.body;

//   // Validate required fields
//   if (!facultyId || !facultyName || !department || !password || !email) {
//     return res.status(400).json({ message: 'All fields are required' });
//   }

//   // Validate password length
//   if (password.length < 6) {
//     return res.status(400).json({ message: 'Password must be at least 6 characters long' });
//   }

//   try {
//     // Check if the faculty ID or email already exists
//     const existingFaculty = await db('faculty')
//       .where({ FACULTY_ID: facultyId })
//       .orWhere({ EMAIL: email })
//       .first();

//     if (existingFaculty) {
//       return res.status(400).json({ message: 'Faculty ID or email already exists' });
//     }

//     // Hash the password before storing
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Insert the faculty record into the database
//     await db('faculty').insert({
//       FACULTY_ID: facultyId,
//       FACULTY_NAME: facultyName,
//       DEPARTMENT: department,
//       PASSWORD: hashedPassword,
//       EMAIL: email
//     });

//     // Send confirmation response
//     res.status(201).json({ message: 'Faculty member successfully signed up' });
//   } catch (error) {
//     console.error('Error adding faculty:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };



// // Login controller
// export const login = async (req, res) => {
//   const { email, password, role } = req.body;

//   // Validate required fields
//   if (!email || !password || !role) {
//     return res.status(400).json({ message: 'Email, password, and role are required' });
//   }

//   try {
//     // Fetch faculty based on email
//     const faculty = await db('faculty').where({ EMAIL: email }).first();

//     if (!faculty) {
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }

//     // Check if the password is correct
//     const isPasswordValid = await bcrypt.compare(password, faculty.PASSWORD);

//     if (!isPasswordValid) {
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }

//     // Check the role and fetch additional information if needed
//     if (role.toLowerCase() === 'hod') {
//       // Verify if the HOD's faculty ID exists in the department table
//       const department = await db('department')
//         .where({ HOD_ID: faculty.FACULTY_ID })
//         .first();

//       if (!department) {
//         return res.status(401).json({ message: 'Invalid HOD credentials' });
//       }

//       // Send branch name as response
//       return res.status(200).json({ message: 'Login successful', department: department.BRANCH });
//     } 
    
//     return res.status(200).json({ message: 'Login successful' });
    
//   } catch (error) {
//     console.error('Error during login:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

/*

import db from '../db/knexfile.js';
import bcrypt from 'bcryptjs'; // Use bcryptjs instead of bcrypt
import { generateTokens, verifyAccessToken, regenerateTokens } from '../utils/JWT.js';

// Function to fetch departments
export const getDepartments = async (req, res) => {
  try {
    const departments = await db('department').select('BRANCH');
    res.status(200).json(departments.map(dept => dept.BRANCH));
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ message: 'Failed to fetch departments' });
  }
};

// Add a faculty member (signup)
export const addFaculty = async (req, res) => {
  const { facultyId, facultyName, department, password, email } = req.body;

  if (!facultyId || !facultyName || !department || !password || !email) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  try {
    const existingFaculty = await db('faculty')
      .where({ FACULTY_ID: facultyId })
      .orWhere({ EMAIL: email })
      .first();

    if (existingFaculty) {
      return res.status(400).json({ message: 'Faculty ID or email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db('faculty').insert({
      FACULTY_ID: facultyId,
      FACULTY_NAME: facultyName,
      DEPARTMENT: department,
      PASSWORD: hashedPassword,
      EMAIL: email
    });

    res.status(201).json({ message: 'Faculty member successfully signed up' });
  } catch (error) {
    console.error('Error adding faculty:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Login controller
export const login = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Email, password, and role are required' });
  }

  try {
    const faculty = await db('faculty').where({ EMAIL: email }).first();

    if (!faculty) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, faculty.PASSWORD);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const tokens = generateTokens(faculty.FACULTY_ID);

    await db('faculty').where({ FACULTY_ID: faculty.FACULTY_ID }).update({ REFRESH_TOKEN: tokens.refreshToken });

    res.cookie('accessToken', tokens.accessToken, { httpOnly: true, secure: true });
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: true });

    if (role.toLowerCase() === 'hod') {
      const department = await db('department')
        .where({ HOD_ID: faculty.FACULTY_ID })
        .first();

      if (!department) {
        return res.status(401).json({ message: 'Invalid HOD credentials' });
      }

      return res.status(200).json({ message: 'Login successful', department: department.BRANCH });
    }

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


*/

/*
import db from '../db/knexfile.js';
import bcrypt from 'bcryptjs'; // Use bcryptjs instead of bcrypt
import { generateTokens, verifyAccessToken, regenerateTokens } from '../utils/JWT.js';

// Function to fetch departments
export const getDepartments = async (req, res) => {
  try {
    const departments = await db('department').select('BRANCH');
    res.status(200).json(departments.map(dept => dept.BRANCH));
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ message: 'Failed to fetch departments' });
  }
};

// Add a faculty member (signup)
export const addFaculty = async (req, res) => {
  const { facultyId, facultyName, department, password, email, isHod } = req.body;

  if (!facultyId || !facultyName || !department || !password || !email) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  try {
    const existingFaculty = await db('faculty')
      .where({ FACULTY_ID: facultyId })
      .orWhere({ EMAIL: email })
      .first();

    if (existingFaculty) {
      return res.status(400).json({ message: 'Faculty ID or email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db('faculty').insert({
      FACULTY_ID: facultyId,
      FACULTY_NAME: facultyName,
      DEPARTMENT: department,
      PASSWORD: hashedPassword,
      EMAIL: email
    });

    if (isHod) {
      await db('department')
        .where({ BRANCH: department })
        .update({ HOD_ID: facultyId });
    }

    res.status(201).json({ message: 'Faculty member successfully signed up' });
  } catch (error) {
    console.error('Error adding faculty:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Login controller
export const login = async (req, res) => {
  const { email, password, role } = req.body;

  // Log received email, password, and role
  console.log('Received Email:', email);
  console.log('Received Password:', password);
  console.log('Received Role:', role);

  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Email, password, and role are required' });
  }

  try {
    const faculty = await db('faculty').where({ EMAIL: email }).first();

    if (!faculty) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, faculty.PASSWORD);
    console.log('Stored Password:', faculty.PASSWORD);
console.log('Entered Password:', password);
console.log('Is Password Valid:', isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const tokens = generateTokens(faculty.FACULTY_ID);

    await db('faculty').where({ FACULTY_ID: faculty.FACULTY_ID }).update({ REFRESH_TOKEN: tokens.refreshToken });

    res.cookie('accessToken', tokens.accessToken, { httpOnly: true, secure: true });
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: true });

    if (role.toLowerCase() === 'hod') {
      const department = await db('department')
        .where({ HOD_ID: faculty.FACULTY_ID })
        .first();

        console.log(department)

      if (!department) {
        return res.status(401).json({ message: 'Invalid HOD credentials' });
      }

      return res.status(200).json({ message: 'Login successful', role: 'HOD', department: department.BRANCH });
    }

    res.status(200).json({ message: 'Login successful', role: 'Faculty' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
*/


import db from '../db/knexfile.js';
import bcrypt from 'bcryptjs'; // Use bcryptjs instead of bcrypt
import { generateTokens, verifyAccessToken, regenerateTokens } from '../utils/JWT.js';

// Function to fetch departments
export const getDepartments = async (req, res) => {
  try {
    const departments = await db('department').select('BRANCH');
    res.status(200).json(departments.map(dept => dept.BRANCH));
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ message: 'Failed to fetch departments' });
  }
};

// Add a faculty member (signup)
export const addFaculty = async (req, res) => {
  const { facultyId, facultyName, department, password, email } = req.body;

  if (!facultyId || !facultyName || !department || !password || !email) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  try {
    const existingFaculty = await db('faculty')
      .where({ FACULTY_ID: facultyId })
      .orWhere({ EMAIL: email })
      .first();

    if (existingFaculty) {
      return res.status(400).json({ message: 'Faculty ID or email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db('faculty').insert({
      FACULTY_ID: facultyId,
      FACULTY_NAME: facultyName,
      DEPARTMENT: department,
      PASSWORD: hashedPassword,
      EMAIL: email
    });

    res.status(201).json({ message: 'Faculty member successfully signed up' });
  } catch (error) {
    console.error('Error adding faculty:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Login controller
export const login = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Email, password, and role are required' });
  }

  try {
    const faculty = await db('faculty').where({ EMAIL: email }).first();

    if (!faculty) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, faculty.PASSWORD);


    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const tokens = generateTokens(faculty.FACULTY_ID);

    await db('faculty').where({ FACULTY_ID: faculty.FACULTY_ID }).update({ REFRESH_TOKEN: tokens.refreshToken });

    res.cookie('accessToken', tokens.accessToken, { httpOnly: true, secure: true });
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: true });

    if (role.toLowerCase() === 'hod') {
      const department = await db('department')
        .where({ HOD_ID: faculty.FACULTY_ID })
        .first();

        

      if (!department) {
        return res.status(401).json({ message: 'Invalid HOD credentials' });
      }
      return res.status(200).json({ message: 'Login successful', role: 'HOD', department: department.BRANCH });
    }

    res.status(200).json({ message: 'Login successful', role: 'Faculty' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


