


import { verifyAccessToken, verifyRefreshToken, generateTokens } from '../utils/JWT.js';
import db from '../db/knexfile.js';

/*
export const verifyJWT = async (req, res, next) => {
  console.log("firstt")
  try {
    const accessToken = req.cookies?.accessToken;
    // console.log('Access Token:', accessToken);

    if (!accessToken) {
      return res.status(401).send("Tokens missing");
    }

    // Verify access token
    try {
      verifyAccessToken(accessToken);
      return next(); // Token is valid, proceed to the next middleware
    } catch (err) {
      // Access token is invalid or expired
      // console.log('Access token verification failed:', err.message);

      const refreshToken = req.cookies?.authRefreshToken;
      if (!refreshToken) {
        console.log("first")
        return res.status(401).send("Invalid or expired refresh token");
      }

      try {
        // Verify refresh token
        const decodedRefreshToken = verifyRefreshToken(refreshToken);
        // console.log('Refresh Token Decoded:', decodedRefreshToken);

        console.log("tttt")

        // Retrieve user based on refresh token ID
        const [user] = await db('faculty').select('FACULTY_ID', 'REFRESH_TOKEN').where({ FACULTY_ID: decodedRefreshToken.id });

        if (!user || refreshToken !== user.REFRESH_TOKEN) {
          return res.status(401).send("Invalid refresh token");
        }

        // Generate new access token
        const tokens = generateTokens(user.FACULTY_ID);

        // console.log("new token generated")

        // Set new access token in cookies
        res.cookie('accessToken', tokens.accessToken, { secure: true, httpOnly: true, maxAge: 3600000 });

        return next(); // Proceed with the new access token

      } catch (refreshError) {
         // Refresh token verification failed, delete tokens and user data
         res.clearCookie('accessToken');
         res.clearCookie('authRefreshToken');
         res.clearCookie('userData');
         
        console.error('Refresh token verification failed:', refreshError.message);
        return res.status(401).send("Invalid or expired refresh token");
      }
    }
  } catch (error) {
    console.error('Error in JWT verification middleware:', error.message);
    return res.status(500).send("Internal Server Error");
  }
};
*/

/*
export const verifyJWT = async (req, res, next) => {
  try {
    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.authRefreshToken;

    // If access token is missing, check for refresh token
    if (!accessToken) {
      if (!refreshToken) {
        return res.status(401).send("Tokens missing");
      }

      try {
        // Verify refresh token
        const decodedRefreshToken = verifyRefreshToken(refreshToken);

        // Retrieve user based on refresh token ID
        const [user] = await db('faculty').select('FACULTY_ID', 'REFRESH_TOKEN').where({ FACULTY_ID: decodedRefreshToken.id });

        if (!user || refreshToken !== user.REFRESH_TOKEN) {
          return res.status(401).send("Invalid or expired refresh token");
        }

        // Generate new access token
        const tokens = generateTokens(user.FACULTY_ID);

        // Set new access token in cookies
        res.cookie('accessToken', tokens.accessToken, { secure: true, httpOnly: true, maxAge: 3600000 });

        return next(); // Proceed with the new access token

      } catch (refreshError) {
        // Refresh token verification failed, clear tokens and user data
        res.clearCookie('accessToken');
        res.clearCookie('authRefreshToken');
        res.clearCookie('userData');

        console.error('Refresh token verification failed:', refreshError.message);
        return res.status(401).send("Invalid or expired refresh token");
      }
    }

    // If access token is present, verify it
    try {
      verifyAccessToken(accessToken);
      return next(); // Token is valid, proceed to the next middleware

    } catch (err) {
      // Access token is invalid or expired, fall back to refresh token logic
      if (!refreshToken) {
        return res.status(401).send("Invalid or expired access token and no refresh token available");
      }

      try {
        // Verify refresh token
        const decodedRefreshToken = verifyRefreshToken(refreshToken);

        // Retrieve user based on refresh token ID
        const [user] = await db('faculty').select('FACULTY_ID', 'REFRESH_TOKEN').where({ FACULTY_ID: decodedRefreshToken.id });

        if (!user || refreshToken !== user.REFRESH_TOKEN) {
          return res.status(401).send("Invalid or expired refresh token");
        }

        // Generate new access token
        const tokens = generateTokens(user.FACULTY_ID);

        // Set new access token in cookies
        res.cookie('accessToken', tokens.accessToken, { secure: true, httpOnly: true, maxAge: 3600000 });

        return next(); // Proceed with the new access token

      } catch (refreshError) {
        // Refresh token verification failed, clear tokens and user data
        res.clearCookie('accessToken');
        res.clearCookie('authRefreshToken');
        res.clearCookie('userData');

        console.error('Refresh token verification failed:', refreshError.message);
        return res.status(401).send("Invalid or expired refresh token");
      }
    }
  } catch (error) {
    console.error('Error in JWT verification middleware:', error.message);
    return res.status(500).send("Internal Server Error");
  }
};
*/

export const verifyJWT = async (req, res, next) => {
  try {
    const accessToken = req.headers['authorization']?.split(' ')[1]; // Expecting "Bearer <token>"
    const refreshToken = req.headers['x-refresh-token']; // Refresh token from custom header

    // If access token is missing, check for refresh token
    if (!accessToken) {
      if (!refreshToken) {
        return res.status(401).json({ message: "Tokens missing" });
      }

      try {
        // Verify refresh token
        const decodedRefreshToken = verifyRefreshToken(refreshToken);

        // Retrieve user based on refresh token ID
        const user = await db('faculty').select('FACULTY_ID', 'REFRESH_TOKEN').where({ FACULTY_ID: decodedRefreshToken.id }).first();

        if (!user || refreshToken !== user.REFRESH_TOKEN) {
          return res.status(401).json({ message: "Invalid or expired refresh token" });
        }

        // Generate new access token
        const newTokens = generateTokens(user.FACULTY_ID);

        // Send new access token in response headers
        res.setHeader('x-access-token', newTokens.accessToken);

        return next(); // Proceed with the new access token

      } catch (refreshError) {
        console.error('Refresh token verification failed:', refreshError.message);
        return res.status(401).json({ message: "Invalid or expired refresh token" });
      }
    }

    // If access token is present, verify it
    try {
      verifyAccessToken(accessToken);
      return next(); // Token is valid, proceed to the next middleware

    } catch (err) {
      // Access token is invalid or expired, fall back to refresh token logic
      if (!refreshToken) {
        return res.status(401).json({ message: "Invalid or expired access token and no refresh token available" });
      }

      try {
        // Verify refresh token
        const decodedRefreshToken = verifyRefreshToken(refreshToken);

        // Retrieve user based on refresh token ID
        const user = await db('faculty').select('FACULTY_ID', 'REFRESH_TOKEN').where({ FACULTY_ID: decodedRefreshToken.id }).first();

        if (!user || refreshToken !== user.REFRESH_TOKEN) {
          return res.status(401).json({ message: "Invalid or expired refresh token" });
        }

        // Generate new access token
        const newTokens = generateTokens(user.FACULTY_ID);

        // Send new access token in response headers
        res.setHeader('x-access-token', newTokens.accessToken);

        return next(); // Proceed with the new access token

      } catch (refreshError) {
        console.error('Refresh token verification failed:', refreshError.message);
        return res.status(401).json({ message: "Invalid or expired refresh token" });
      }
    }
  } catch (error) {
    console.error('Error in JWT verification middleware:', error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


