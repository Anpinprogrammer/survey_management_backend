import { validationResult } from 'express-validator';
import authService from '../services/auth.service.js';

class AuthController {
  /**
   * POST /api/auth/register
   * Registra un nuevo usuario
   */
  async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const { email, password, fullName, organizationId } = req.body;
      
      /**
       * const result = await authService.registroSeque({
        email,
        password,
        fullName,
        organizationId,
      });
       */
      

      const result = await authService.register({
        email,
        password,
        fullName,
        organizationId,
      });
       
      
      
      res.status(201).json({
        message: 'User registered successfully',
        data: result,
      });
    } catch (error) {
      console.error('Register error:', error);
      
      if (error.message === 'Email already registered') {
        return res.status(409).json({ error: error.message });
      }
      
      res.status(500).json({ 
        error: 'Registration failed',
        message: error.message 
      });
    }
  }
  
  /**
   * POST /api/auth/login
   * Inicia sesión
   */
  async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const { email, password } = req.body;
      
      const result = await authService.login(email, password);
      
      res.json({
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.message === 'Invalid credentials' || 
          error.message === 'Account is deactivated') {
        return res.status(401).json({ error: error.message });
      }
      
      res.status(500).json({ 
        error: 'Login failed',
        message: error.message 
      });
    }
  }
  
  /**
   * POST /api/auth/refresh
   * Refresca el access token
   */
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        return res.status(400).json({ 
          error: 'Refresh token required' 
        });
      }
      
      const result = await authService.refreshToken(refreshToken);
      
      res.json({
        message: 'Token refreshed successfully',
        data: result,
      });
    } catch (error) {
      console.error('Refresh token error:', error);
      
      return res.status(401).json({ 
        error: 'Invalid refresh token',
        message: error.message 
      });
    }
  }
  
  /**
   * POST /api/auth/logout
   * Cierra sesión
   */
  async logout(req, res) {
    try {
      const { refreshToken } = req.body;
      
      await authService.logout(refreshToken);
      
      res.json({
        message: 'Logged out successfully',
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ 
        error: 'Logout failed',
        message: error.message 
      });
    }
  }
  
  /**
   * GET /api/auth/me
   * Obtiene información del usuario actual
   */
  async getCurrentUser(req, res) {
    try {
      const user = await authService.getCurrentUser(req.user.id);
      
      res.json({
        data: user,
      });
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({ 
        error: 'Failed to get user information',
        message: error.message 
      });
    }
  }
  
  /**
   * POST /api/auth/change-password
   * Cambia la contraseña del usuario
   */
  async changePassword(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const { currentPassword, newPassword } = req.body;
      
      await authService.changePassword(
        req.user.id,
        currentPassword,
        newPassword
      );
      
      res.json({
        message: 'Password changed successfully',
      });
    } catch (error) {
      console.error('Change password error:', error);
      
      if (error.message === 'Current password is incorrect') {
        return res.status(400).json({ error: error.message });
      }
      
      res.status(500).json({ 
        error: 'Failed to change password',
        message: error.message 
      });
    }
  }
}

export default new AuthController();