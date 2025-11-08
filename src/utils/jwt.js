import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';

/**
 * Genera un access token JWT
 */
const generateAccessToken = (userId, email) => {
  return jwt.sign(
    { 
      userId, 
      email,
      type: 'access'
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

/**
 * Genera un refresh token JWT
 */
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { 
      userId,
      type: 'refresh'
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
};

/**
 * Verifica un access token
 */
const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid access token');
  }
};

/**
 * Verifica un refresh token
 */
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};

/**
 * Guarda un refresh token en la base de datos
 */
const saveRefreshToken = async (userId, token) => {
  const decoded = verifyRefreshToken(token);
  const expiresAt = new Date(decoded.exp * 1000);
  
  await query(
    `INSERT INTO refresh_tokens (user_id, token, expires_at)
     VALUES ($1, $2, $3)`,
    [userId, token, expiresAt]
  );
};

/**
 * Revoca un refresh token
 */
const revokeRefreshToken = async (token) => {
  await query(
    `UPDATE refresh_tokens 
     SET revoked = true 
     WHERE token = $1`,
    [token]
  );
};

/**
 * Revoca todos los refresh tokens de un usuario
 */
const revokeAllUserTokens = async (userId) => {
  await query(
    `UPDATE refresh_tokens 
     SET revoked = true 
     WHERE user_id = $1 AND revoked = false`,
    [userId]
  );
};

/**
 * Verifica si un refresh token es válido
 */
const isRefreshTokenValid = async (token) => {
  const result = await query(
    `SELECT id, expires_at, revoked 
     FROM refresh_tokens 
     WHERE token = $1`,
    [token]
  );
  
  if (result.rows.length === 0) {
    return false;
  }
  
  const tokenData = result.rows[0];
  
  if (tokenData.revoked) {
    return false;
  }
  
  if (new Date() > new Date(tokenData.expires_at)) {
    return false;
  }
  
  return true;
};

/**
 * Limpia tokens expirados (ejecutar periódicamente)
 */
const cleanExpiredTokens = async () => {
  await query(
    `DELETE FROM refresh_tokens 
     WHERE expires_at < NOW() OR revoked = true`
  );
};

export {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  saveRefreshToken,
  revokeRefreshToken,
  revokeAllUserTokens,
  isRefreshTokenValid,
  cleanExpiredTokens,
};