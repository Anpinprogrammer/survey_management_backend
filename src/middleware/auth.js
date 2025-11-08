import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';

/**
 * Middleware para verificar JWT token
 */
const authenticate = async (req, res, next) => {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'No token provided' 
      });
    }
    
    const token = authHeader.substring(7); // Remover 'Bearer '
    
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verificar que el usuario existe y está activo
    const result = await query(
      `SELECT u.id, u.email, u.full_name, u.organization_id, u.is_active,
              u.google_access_token, u.google_refresh_token
       FROM users u
       WHERE u.id = $1`,
      [decoded.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ 
        error: 'Authentication failed',
        message: 'User not found' 
      });
    }
    
    const user = result.rows[0];
    
    if (!user.is_active) {
      return res.status(403).json({ 
        error: 'Account disabled',
        message: 'Your account has been deactivated' 
      });
    }
    
    // Agregar información del usuario al request
    req.user = {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      organizationId: user.organization_id,
      googleAccessToken: user.google_access_token,
      googleRefreshToken: user.google_refresh_token,
    };
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Invalid token',
        message: 'The provided token is invalid' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expired',
        message: 'Your session has expired. Please login again' 
      });
    }
    
    console.error('Authentication error:', error);
    return res.status(500).json({ 
      error: 'Authentication error',
      message: 'An error occurred during authentication' 
    });
  }
};

/**
 * Middleware para verificar permisos específicos
 */
const authorize = (requiredPermissions) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ 
          error: 'Authentication required',
          message: 'User not authenticated' 
        });
      }
      
      // Obtener permisos del usuario
      const result = await query(
        `SELECT DISTINCT p.name
         FROM permissions p
         INNER JOIN role_permissions rp ON p.id = rp.permission_id
         INNER JOIN user_roles ur ON rp.role_id = ur.role_id
         WHERE ur.user_id = $1`,
        [req.user.id]
      );
      
      const userPermissions = result.rows.map(row => row.name);
      
      // Verificar si el usuario tiene alguno de los permisos requeridos
      const hasPermission = requiredPermissions.some(permission => 
        userPermissions.includes(permission)
      );
      
      if (!hasPermission) {
        return res.status(403).json({ 
          error: 'Insufficient permissions',
          message: 'You do not have permission to perform this action',
          required: requiredPermissions,
          userPermissions: userPermissions
        });
      }
      
      // Agregar permisos al request para uso posterior
      req.userPermissions = userPermissions;
      
      next();
    } catch (error) {
      console.error('Authorization error:', error);
      return res.status(500).json({ 
        error: 'Authorization error',
        message: 'An error occurred during authorization' 
      });
    }
  };
};

/**
 * Middleware para verificar que el usuario pertenece a la misma organización
 */
const checkOrganization = async (req, res, next) => {
  try {
    const { organizationId } = req.params;
    
    if (req.user.organizationId !== organizationId) {
      return res.status(403).json({ 
        error: 'Access denied',
        message: 'You can only access resources from your organization' 
      });
    }
    
    next();
  } catch (error) {
    console.error('Organization check error:', error);
    return res.status(500).json({ 
      error: 'Authorization error',
      message: 'An error occurred during organization check' 
    });
  }
};

export {
  authenticate,
  authorize,
  checkOrganization,
};