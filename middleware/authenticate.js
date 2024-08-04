


import { verifyAccessToken, verifyRefreshToken, generateTokens } from '../utils/JWT.js';
import db from '../db/knexfile.js';

export const verifyJWT = async (req, res, next) => {
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
        return res.status(401).send("Invalid or expired refresh token");
      }

      try {
        // Verify refresh token
        const decodedRefreshToken = verifyRefreshToken(refreshToken);
        // console.log('Refresh Token Decoded:', decodedRefreshToken);

        // Retrieve user based on refresh token ID
        const [user] = await db('faculty').select('FACULTY_ID', 'REFRESH_TOKEN').where({ FACULTY_ID: decodedRefreshToken.id });

        if (!user || refreshToken !== user.REFRESH_TOKEN) {
          return res.status(401).send("Invalid refresh token");
        }

        // Generate new access token
        const tokens = generateTokens(user.FACULTY_ID);

        // Set new access token in cookies
        res.cookie('accessToken', tokens.accessToken, { secure: true, httpOnly: true });

        return next(); // Proceed with the new access token

      } catch (refreshError) {
        console.error('Refresh token verification failed:', refreshError.message);
        return res.status(401).send("Invalid or expired refresh token");
      }
    }
  } catch (error) {
    console.error('Error in JWT verification middleware:', error.message);
    return res.status(500).send("Internal Server Error");
  }
};
