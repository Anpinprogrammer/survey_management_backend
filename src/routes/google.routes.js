import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { getAuthUrl, getTokensFromCode } from '../config/google.js';
import { query } from '../config/database.js';

const router = express.Router();

/**
 * GET /api/google/auth-url
 * Obtiene la URL de autorización de Google OAuth
 */
router.get('/auth-url', authenticate, (req, res) => {
  try {
    const authUrl = getAuthUrl();
    res.json({ 
      data: { authUrl },
      message: 'Use this URL to authorize access to Google Forms'
    });
  } catch (error) {
    console.error('Error generating auth URL:', error);
    res.status(500).json({ 
      error: 'Failed to generate authorization URL',
      message: error.message 
    });
  }
});

/**
 * POST /api/google/callback
 * Maneja el callback de Google OAuth
 */
router.post('/callback', authenticate, async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ 
        error: 'Authorization code is required' 
      });
    }
    
    // Obtener tokens de Google
    const tokens = await getTokensFromCode(code);
    
    // Guardar tokens en la base de datos
    await query(
      `UPDATE users 
       SET google_access_token = $1,
           google_refresh_token = $2,
           google_token_expiry = $3,
           updated_at = NOW()
       WHERE id = $4`,
      [
        tokens.access_token,
        tokens.refresh_token,
        tokens.expiry_date ? new Date(tokens.expiry_date) : null,
        req.user.id
      ]
    );
    
    res.json({ 
      message: 'Google account connected successfully',
      data: {
        hasGoogleAuth: true
      }
    });
  } catch (error) {
    console.error('Error handling Google callback:', error);
    res.status(500).json({ 
      error: 'Failed to connect Google account',
      message: error.message 
    });
  }
});

/**
 * DELETE /api/google/disconnect
 * Desconecta la cuenta de Google
 */
router.delete('/disconnect', authenticate, async (req, res) => {
  try {
    await query(
      `UPDATE users 
       SET google_access_token = NULL,
           google_refresh_token = NULL,
           google_token_expiry = NULL,
           updated_at = NOW()
       WHERE id = $1`,
      [req.user.id]
    );
    
    res.json({ 
      message: 'Google account disconnected successfully',
      data: {
        hasGoogleAuth: false
      }
    });
  } catch (error) {
    console.error('Error disconnecting Google account:', error);
    res.status(500).json({ 
      error: 'Failed to disconnect Google account',
      message: error.message 
    });
  }
});

// Placeholder para otras rutas de Google Forms
router.post('/forms/create', authenticate, (req, res) => {
  res.json({ message: 'Create Google Form route - to be implemented' });
});

router.get('/forms/:formId/responses', authenticate, (req, res) => {
  res.json({ message: 'Get Google Form responses route - to be implemented' });
});

export default router;