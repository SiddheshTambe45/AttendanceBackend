

// import db from '../db/knexfile.js';
// import bcrypt from 'bcryptjs'; // Use bcryptjs instead of bcrypt
// import { generateTokens, verifyRefreshToken } from '../utils/JWT.js';

// // Login
// export const login = async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ message: 'Email and password are required' });
//   }

//   try {
//     const faculty = await db('faculty').where({ EMAIL: email }).first();

//     if (!faculty) {
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }

//     const isPasswordValid = await bcrypt.compare(password, faculty.PASSWORD);

//     if (!isPasswordValid) {
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }

//     const tokens = generateTokens(faculty.FACULTY_ID);

//     await db('faculty').where({ FACULTY_ID: faculty.FACULTY_ID }).update({ REFRESH_TOKEN: tokens.refreshToken });

//     res.cookie("accessToken", tokens.accessToken, { httpOnly: true, secure: true });
//     res.cookie("authRefreshToken", tokens.refreshToken, { httpOnly: true, secure: true});

//     const responsePayload = {
//       message: 'Login successful',
//       role: email.startsWith('hod') ? 'HOD' : 'Faculty',
//       accessToken: tokens.accessToken
//     };

//     if (email.startsWith('hod')) {
//       const department = await db('department').where({ HOD_ID: faculty.FACULTY_ID }).first();

//       if (!department) {
//         return res.status(401).json({ message: 'Invalid HOD credentials or not assigned as HOD' });
//       }

//       responsePayload.department = department.BRANCH;
//     }

//     res.status(200).json(responsePayload);
//   } catch (error) {
//     console.error('Error during login:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// // Refresh Tokens
// export const refreshTokens = async (req, res) => {
//   const authRefreshToken = req.cookies?.authRefreshToken;
//   console.log('-/-',authRefreshToken)

//   if (!authRefreshToken) {
//     return res.status(401).json({ message: 'No refresh token provided' });
//   }

//   try {
//     const decoded = verifyRefreshToken(authRefreshToken);
//     const user = await db('faculty').where({ FACULTY_ID: decoded.id }).select('*').first();

//     if (!user || authRefreshToken !== user.REFRESH_TOKEN) {
//       return res.status(403).json({ message: 'Invalid refresh token' });
//     }

//     const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.FACULTY_ID);
//     await db('faculty').where({ FACULTY_ID: user.FACULTY_ID }).update({ REFRESH_TOKEN: newRefreshToken });

//     const options = { httpOnly: true, secure: true, sameSite: 'None' };
//     res.cookie("accessToken", accessToken, options);
//     res.cookie("authRefreshToken", newRefreshToken, options);

//     res.status(200).json({ accessToken, refreshToken: newRefreshToken, message: 'Tokens refreshed successfully' });
//   } catch (error) {
//     res.status(403).json({ message: 'Invalid or expired refresh token' });
//   }
// };

// // Add Faculty
// export const addFaculty = async (req, res) => {
//   const { facultyId, facultyName, department, password, email } = req.body;

//   if (!facultyId || !facultyName || !department || !password || !email) {
//     return res.status(400).json({ message: 'All fields are required' });
//   }

//   if (password.length < 6) {
//     return res.status(400).json({ message: 'Password must be at least 6 characters long' });
//   }

//   try {
//     const existingFaculty = await db('faculty')
//       .where({ FACULTY_ID: facultyId })
//       .orWhere({ EMAIL: email })
//       .first();

//     if (existingFaculty) {
//       return res.status(400).json({ message: 'Faculty ID or email already exists' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     await db('faculty').insert({
//       FACULTY_ID: facultyId,
//       FACULTY_NAME: facultyName,
//       DEPARTMENT: department,
//       PASSWORD: hashedPassword,
//       EMAIL: email
//     });

//     res.status(201).json({ message: 'Faculty member successfully signed up' });
//   } catch (error) {
//     console.error('Error adding faculty:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// /*
// // Assign HOD by Principal
// export const assignHOD = async (req, res) => {
//   const { branch, facultyId } = req.body;

//   if (!branch || !facultyId) {
//     return res.status(400).json({ message: 'Branch and Faculty ID are required' });
//   }

//   try {
//     const faculty = await db('faculty').where({ FACULTY_ID: facultyId }).first();

//     if (!faculty) {
//       return res.status(404).json({ message: 'Faculty not found' });
//     }

//     const existingAssignment = await db('department').where({ BRANCH: branch }).first();

//     if (existingAssignment) {
//       return res.status(400).json({ message: 'Branch already has an assigned HOD' });
//     }

//     await db('department').insert({
//       BRANCH: branch,
//       HOD_ID: facultyId
//     });

//     res.status(200).json({ message: 'HOD assigned successfully' });
//   } catch (error) {
//     console.error('Error assigning HOD:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };
// */

// // Fetch Departments
// export const getDepartments = async (req, res) => {
//   try {
//     const departments = await db('department').select('BRANCH');
//     res.status(200).json(departments.map(dept => dept.BRANCH));
//   } catch (error) {
//     console.error('Error fetching departments:', error);
//     res.status(500).json({ message: 'Failed to fetch departments' });
//   }
// };


import db from '../db/knexfile.js';
import bcrypt from 'bcryptjs'; // Use bcryptjs instead of bcrypt
import { generateTokens, verifyRefreshToken } from '../utils/JWT.js';

// Login 
/*
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  console.log('first')
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

    res.cookie("accessToken", tokens.accessToken, { httpOnly: true, secure: true });
    res.cookie("authRefreshToken", tokens.refreshToken, { httpOnly: true, secure: true});

    // Get department information
    const department = await db('department').where({ BRANCH: faculty.DEPARTMENT }).first();

    const responsePayload = {
      message: 'Login successful',
      role: email.startsWith('hod') ? 'HOD' : 'Faculty',
      accessToken: tokens.accessToken,
      department: department ? department.BRANCH : null // Add department info here
    };

    if (email.startsWith('hod')) {
      const department = await db('department').where({ HOD_ID: faculty.FACULTY_ID }).first();

      if (!department) {
        return res.status(401).json({ message: 'Invalid HOD credentials or not assigned as HOD' });
      }

      responsePayload.department = department.BRANCH; // Update department for HOD
    }

    res.status(200).json(responsePayload);
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 
*/

// Refresh Tokens
export const refreshTokens = async (req, res) => {
  const authRefreshToken = req.cookies?.authRefreshToken;

  if (!authRefreshToken) {
    return res.status(401).json({ message: 'No refresh token provided' });
  }

  try {
    const decoded = verifyRefreshToken(authRefreshToken);
    const user = await db('faculty').where({ FACULTY_ID: decoded.id }).select('*').first();

    if (!user || authRefreshToken !== user.REFRESH_TOKEN) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.FACULTY_ID);
    await db('faculty').where({ FACULTY_ID: user.FACULTY_ID }).update({ REFRESH_TOKEN: newRefreshToken });

    const options = { httpOnly: true, secure: true, sameSite: 'None' };
    res.cookie("accessToken", accessToken, options);
    res.cookie("authRefreshToken", newRefreshToken, options);

    res.status(200).json({ accessToken, refreshToken: newRefreshToken, message: 'Tokens refreshed successfully' });
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
};

// Add Faculty
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

// Fetch Departments
export const getDepartments = async (req, res) => {
  try {
    const departments = await db('department').select('BRANCH');
    res.status(200).json(departments.map(dept => dept.BRANCH));
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ message: 'Failed to fetch departments' });
  }
};

// Sign Up HOD
export const signUpHOD = async (req, res) => {
  const { hodEmail, facultyEmail, facultyPassword, facultyId, department, hodPassword } = req.body;
  // console.log(hodEmail, facultyEmail, facultyPassword, facultyId, department, hodPassword);

  if (!hodEmail || !facultyEmail || !facultyPassword || !facultyId || !department || !hodPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (hodPassword.length < 6) {
    return res.status(400).json({ message: 'HOD password must be at least 6 characters long' });
  }

  try {
    // Verify Faculty
    const faculty = await db('faculty').where({ EMAIL: facultyEmail }).first();

    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    const isFacultyPasswordValid = await bcrypt.compare(facultyPassword, faculty.PASSWORD);

    if (!isFacultyPasswordValid || faculty.FACULTY_ID !== facultyId || faculty.DEPARTMENT !== department) {
      return res.status(401).json({ message: 'Invalid faculty credentials or mismatched information' });
    }

    // Add HOD
    const hashedHodPassword = await bcrypt.hash(hodPassword, 10);

    await db('department').where({ BRANCH: department }).update({
      HOD_ID: facultyId,
      EMAIL: hodEmail,
      PASSWORD: hashedHodPassword
    });

    res.status(200).json({ message: 'HOD successfully signed up and assigned' });
  } catch (error) {
    console.error('Error signing up HOD:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Determine if the email is for HOD or Faculty
    const isHod = email.startsWith('hod');

    if (isHod) {
      // Validate HOD
      const department = await db('department').where({ EMAIL: email }).first();

      if (!department) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const isPasswordValid = await bcrypt.compare(password, department.PASSWORD);

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Fetch faculty information for HOD
      const faculty = await db('faculty').where({ FACULTY_ID: department.HOD_ID }).first();

      if (!faculty) {
        return res.status(401).json({ message: 'Invalid HOD credentials or not assigned as HOD' });
      }

      const tokens = generateTokens(faculty.FACULTY_ID);

      await db('faculty').where({ FACULTY_ID: faculty.FACULTY_ID }).update({ REFRESH_TOKEN: tokens.refreshToken });

      res.cookie("accessToken", tokens.accessToken, { httpOnly: true, secure: true });
      res.cookie("authRefreshToken", tokens.refreshToken, { httpOnly: true, secure: true });

      res.status(200).json({
        message: 'Login successful',
        role: 'HOD',
        accessToken: tokens.accessToken,
        department: department.BRANCH
      });

    } else {
      // Validate Faculty
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

      res.cookie("accessToken", tokens.accessToken, { httpOnly: true, secure: true });
      res.cookie("authRefreshToken", tokens.refreshToken, { httpOnly: true, secure: true });

      // Fetch department information for Faculty
      const department = await db('department').where({ BRANCH: faculty.DEPARTMENT }).first();

      res.status(200).json({
        message: 'Login successful',
        role: 'Faculty',
        accessToken: tokens.accessToken,
        department: department ? department.BRANCH : null
      });
    }

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
