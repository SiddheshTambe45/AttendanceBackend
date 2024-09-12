import fs from 'fs-extra'; // Since you prefer using fs-extra
import path from 'path';
import db from '../db/knexfile.js';
import bcrypt from 'bcryptjs'; // Use bcryptjs instead of bcrypt
import { generateTokens, verifyRefreshToken } from '../utils/JWT.js';
import { fileURLToPath } from 'url';
import cloudinary from '../cloudinary/cloudinary.js'; // Adjust the path as needed

// Manually define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const departmentMapping = {
  'CE': 'Computer Engineering',
  'IT': 'Information Technology',
  'AIDS': 'Artificial Intelligence & Data Science',
  'AIML': 'Artificial Intelligence & Machine Learning',
  'IOT': 'Computer Science & Engineering (IOT & Cybersecurity Including Blockchain Technology)',
  'EXTC': 'Electronics & Telecommunication Engineering',
  'ECS': 'Electronics & Computer Science',
  'MECH': 'Mechanical Engineering',
  'FIRST_YEAR': 'FIRST_YEAR'
};



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
/*
export const signUpHOD = async (req, res) => {
  const { hodEmail, facultyEmail, facultyPassword, facultyId, department, hodPassword } = req.body;
  // console.log(hodEmail, facultyEmail, facultyPassword, facultyId, department, hodPassword);

  if (!hodEmail || !facultyEmail || !facultyPassword || !facultyId || !department || !hodPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (hodPassword.length < 6) {
    return res.status(400).json({ message: 'HOD password must be at least 6 characters long' });
  }

  const validHod = await db('department').select('HOD_ID').where({ HOD_ID: facultyId }).first();

  if (!validHod) {
    return res.status(401).json({ message: 'Invalid HOD sign-in' });
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
*/


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

      res.cookie("accessToken", tokens.accessToken, { httpOnly: true, secure: true, maxAge: 3600000, sameSite: 'None' });
      res.cookie("authRefreshToken", tokens.refreshToken, { httpOnly: true, secure: true, maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'None' });

      // Set user data cookie
      res.cookie("userData", JSON.stringify({
        facultyId: faculty.FACULTY_ID,
        role: 'HOD',
        department: department.BRANCH
      }), { httpOnly: false, secure: true, maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'None' }); // 7 days

      res.status(200).json({
        message: 'Login successful',
        // role: 'HOD',
        // facultyId:faculty.FACULTY_ID,
        // accessToken: tokens.accessToken,
        // department: department.BRANCH
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

      res.cookie("accessToken", tokens.accessToken, { httpOnly: true, secure: true, maxAge: 3600000, sameSite: 'None' });
      res.cookie("authRefreshToken", tokens.refreshToken, { httpOnly: true, secure: true, maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'None'  });

      // Set user data cookie
      res.cookie("userData", JSON.stringify({
        facultyId: faculty.FACULTY_ID,
        role: 'Faculty',
        department: faculty ? faculty.DEPARTMENT : null
      }), { httpOnly: false, secure: true, maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'None' }); // 7 days

      // Fetch department information for Faculty
      // const department = await db('department').where({ BRANCH: faculty.DEPARTMENT }).first();

      res.status(200).json({
        message: 'Login successful',
        // facultyId:faculty.FACULTY_ID,
        // role: 'Faculty',
        // accessToken: tokens.accessToken,
        // department: department ? department.BRANCH : null
      });
    }

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



/*
export const addFaculty = async (req, res) => {
  const { facultyId, facultyName, department, password, email } = req.body;

  if (!facultyId || !facultyName || !department || !password || !email) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  const transaction = await db.transaction();

  try {
    const existingFaculty = await transaction('faculty')
      .where({ FACULTY_ID: facultyId })
      .orWhere({ EMAIL: email })
      .first();

    if (existingFaculty) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Faculty ID or email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await transaction('faculty').insert({
      FACULTY_ID: facultyId,
      FACULTY_NAME: facultyName,
      DEPARTMENT: department,
      DEPARTMENT_NAME: departmentMapping[department],
      PASSWORD: hashedPassword,
      EMAIL: email
    });

     // Create folder for the faculty in the facultyFolder directory
     const facultyFolder = path.join(__dirname, '..', 'facultyFolder', facultyId);

     try {
       await fs.ensureDir(facultyFolder);
     } catch (folderError) {
       await transaction.rollback();
       console.error('Error creating faculty folder:', folderError);
       return res.status(500).json({ message: 'Internal server error' });
     }

    await transaction.commit();

    res.status(201).json({ message: 'Faculty member successfully signed up' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error adding faculty:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
*/

// Function to create a text file with faculty details
const createFacultyDetailsFile = (facultyId, facultyName, department) => {
  const content = `Faculty ID: ${facultyId}\nFaculty Name: ${facultyName}\nDepartment: ${department}`;
  const filePath = path.join(__dirname, `${facultyId}.txt`);

  fs.writeFileSync(filePath, content);
  return filePath;
};

// Function to create a text file with HOD details
const createHodDetailsFile = (facultyId, hodEmail, department) => {
  const content = `HOD ID: ${facultyId}\nHOD Email: ${hodEmail}\nDepartment: ${department}`;
  const filePath = path.join(__dirname, `${facultyId}_HOD.txt`);

  fs.writeFileSync(filePath, content);
  return filePath;
};

// Sign Up HOD
export const signUpHOD = async (req, res) => {
  const { hodEmail, facultyEmail, facultyPassword, facultyId, department, hodPassword } = req.body;

  if (!hodEmail || !facultyEmail || !facultyPassword || !facultyId || !department || !hodPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (hodPassword.length < 6) {
    return res.status(400).json({ message: 'HOD password must be at least 6 characters long' });
  }

  const validHod = await db('department').select('HOD_ID').where({ HOD_ID: facultyId }).first();

  if (!validHod) {
    return res.status(401).json({ message: 'Invalid HOD sign-in' });
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

    // Create a text file with HOD details
    const filePath = createHodDetailsFile(facultyId, hodEmail, department);

    // Create unique folder for HOD in Cloudinary by uploading the text file
    const hodFolder = `hodFolder/${facultyId}`;
    await cloudinary.v2.uploader.upload(filePath, {
      folder: hodFolder,
      resource_type: 'raw',
      public_id: 'hod_details'
    });

    // Clean up the local file after upload
    fs.unlinkSync(filePath);

    res.status(200).json({ message: 'HOD successfully signed up and assigned' });
  } catch (error) {
    console.error('Error signing up HOD:', error);
    res.status(500).json({ message: 'Internal server error' });
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

  const transaction = await db.transaction();

  try {
    const existingFaculty = await transaction('faculty')
      .where({ FACULTY_ID: facultyId })
      .orWhere({ EMAIL: email })
      .first();

    if (existingFaculty) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Faculty ID or email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await transaction('faculty').insert({
      FACULTY_ID: facultyId,
      FACULTY_NAME: facultyName,
      DEPARTMENT: department,
      DEPARTMENT_NAME: departmentMapping[department],
      PASSWORD: hashedPassword,
      EMAIL: email
    });

    // Create a text file with faculty details
    const filePath = createFacultyDetailsFile(facultyId, facultyName, department);

    // Create unique folder for Faculty in Cloudinary by uploading the text file
    const facultyFolder = `facultyFolder/${facultyId}`;
    await cloudinary.v2.uploader.upload(filePath, {
      folder: facultyFolder,
      resource_type: 'raw',
      public_id: 'faculty_details'
    });

    // Clean up the local file after upload
    fs.unlinkSync(filePath);

    await transaction.commit();

    res.status(201).json({ message: 'Faculty member successfully signed up' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error adding faculty:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




