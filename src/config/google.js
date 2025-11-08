import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config();

// Scopes necesarios para trabajar con Google Forms
const SCOPES = [
  'https://www.googleapis.com/auth/forms.body',
  'https://www.googleapis.com/auth/forms.responses.readonly',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
];

// Crear cliente OAuth2
const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

/**
 * Genera la URL de autorización para OAuth2
 */
const getAuthUrl = () => {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent', // Fuerza a mostrar el consentimiento para obtener refresh token
  });
};

/**
 * Obtiene tokens a partir del código de autorización
 */
const getTokensFromCode = async (code) => {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    return tokens;
  } catch (error) {
    console.error('Error getting tokens:', error);
    throw new Error('Failed to get tokens from authorization code');
  }
};

/**
 * Configura las credenciales del cliente OAuth2
 */
const setCredentials = (tokens) => {
  oauth2Client.setCredentials(tokens);
};

/**
 * Refresca el access token usando el refresh token
 */
const refreshAccessToken = async (refreshToken) => {
  try {
    oauth2Client.setCredentials({
      refresh_token: refreshToken,
    });
    
    const { credentials } = await oauth2Client.refreshAccessToken();
    return credentials;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw new Error('Failed to refresh access token');
  }
};

/**
 * Obtiene información del usuario autenticado
 */
const getUserInfo = async (accessToken) => {
  try {
    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: 'v2',
    });
    
    oauth2Client.setCredentials({ access_token: accessToken });
    
    const { data } = await oauth2.userinfo.get();
    return data;
  } catch (error) {
    console.error('Error getting user info:', error);
    throw new Error('Failed to get user info');
  }
};

/**
 * Crea una instancia del cliente de Forms con credenciales
 */
const getFormsClient = (accessToken) => {
  const auth = new OAuth2Client();
  auth.setCredentials({ access_token: accessToken });
  
  return google.forms({
    version: 'v1',
    auth: auth,
  });
};

/**
 * Crea una instancia del cliente de Drive con credenciales
 */
const getDriveClient = (accessToken) => {
  const auth = new OAuth2Client();
  auth.setCredentials({ access_token: accessToken });
  
  return google.drive({
    version: 'v3',
    auth: auth,
  });
};

export {
  oauth2Client,
  SCOPES,
  getAuthUrl,
  getTokensFromCode,
  setCredentials,
  refreshAccessToken,
  getUserInfo,
  getFormsClient,
  getDriveClient,
};