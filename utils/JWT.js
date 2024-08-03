import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Function to generate access and refresh tokens
export const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );

  return { accessToken, refreshToken };
};

// Function to verify access token
export const verifyAccessToken = async (token) => {
  try {
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });
    return decoded;
  } catch (err) {
    throw new Error('Invalid or expired access token');
  }
};

// Function to verify refresh token and generate new tokens
export const regenerateTokens = async (refreshToken) => {
  try {
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });

    const { userId } = decoded;
    const newTokens = generateTokens(userId);
    return newTokens;
  } catch (err) {
    throw new Error('Invalid or expired refresh token');
  }
};
