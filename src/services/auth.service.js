import bcrypt from 'bcrypt';
import { query, getClient } from '../config/database.js';
import {
  generateAccessToken,
  generateRefreshToken,
  saveRefreshToken,
  verifyRefreshToken,
  isRefreshTokenValid,
  revokeRefreshToken,
} from '../utils/jwt.js';
import User from '../models/User.js';
import Role from '../models/Role.js';
import UserRoles from '../models/UserRoles.js';

class AuthService {
  /**
   * Registra un nuevo usuario
   */
  async register(userData) {
    const client = await getClient();
    
    try {
      await client.query('BEGIN');
      
      const { email, password, fullName, organizationId } = userData;
      
      // Verificar si el email ya existe
      const existingUser = await client.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );
      
      if (existingUser.rows.length > 0) {
        throw new Error('Email already registered');
      }
      
      // Hash de la contraseña
      const passwordHash = await bcrypt.hash(password, 10);
      
      // Insertar usuario
      const result = await client.query(
        `INSERT INTO users (email, password_hash, full_name, organization_id)
         VALUES ($1, $2, $3, $4)
         RETURNING id, email, full_name, organization_id, created_at`,
        [email, passwordHash, fullName, organizationId]
      );
      
      const user = result.rows[0];
      
      // Asignar rol por defecto (Viewer)
      const viewerRole = await client.query(
        `SELECT id FROM roles 
         WHERE name = 'Viewer' AND organization_id = $1`,
        [organizationId]
      );
      
      if (viewerRole.rows.length > 0) {
        await client.query(
          `INSERT INTO user_roles (user_id, role_id)
           VALUES ($1, $2)`,
          [user.id, viewerRole.rows[0].id]
        );
      }
      
      await client.query('COMMIT');
      
      // Generar tokens
      const accessToken = generateAccessToken(user.id, user.email);
      const refreshToken = generateRefreshToken(user.id);
      await saveRefreshToken(user.id, refreshToken);
      
      return {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          organizationId: user.organization_id,
          createdAt: user.created_at,
        },
        accessToken,
        refreshToken,
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Registro usuario con Sequelize
   */

  async registroSeque(userData) {
    const { email, password, fullName, organizationId } = userData;

    try {
    //Buscar usuario por email
    const existingUser = await User.findOne({ where: { email } })

      if(existingUser){
        throw new Error('Email already registered');
      }

      // Hash de la contraseña
      const passwordHash = await bcrypt.hash(password, 10);

      //Registramos el nuevo usuario
      const newUser = await User.create({
        email,
        password_hash: passwordHash,
        full_name: fullName,
        organization_id: organizationId
      })

      console.log()

      //Asignar rol por defecto
      const viewerRoleId = await Role.findOne({
        where: {
          name: 'Viewer',
          organization_id: organizationId
        },
        attributes: ['id'] //Solo selecciona el campo 'id'
      });

      if(viewerRoleId) {
        await UserRoles.create({
          user_id: newUser.id,
          role_id: viewerRoleId.id
        });
      }
      
      // Generar tokens
      const accessToken = generateAccessToken(newUser.id, newUser.email);
      const refreshToken = generateRefreshToken(newUser.id);
      await saveRefreshToken(newUser.id, refreshToken);

      return {
        user: {
          id: newUser.id,
          email: newUser.email,
          fullName: newUser.full_name,
          organizationId: newUser.organization_id,
          createdAt: newUser.created_at,
        },
        accessToken,
        refreshToken,
      };

      
    } catch (error) {
      console.log(error)
    }
  }
  
  /**
   * Login de usuario
   */
  async login(email, password) {
    // Buscar usuario
    const result = await query(
      `SELECT u.id, u.email, u.password_hash, u.full_name, 
              u.organization_id, u.is_active
       FROM users u
       WHERE u.email = $1`,
      [email]
    );
    
    if (result.rows.length === 0) {
      throw new Error('Invalid credentials');
    }
    
    const user = result.rows[0];
    
    if (!user.is_active) {
      throw new Error('Account is deactivated');
    }
    
    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }
    
    // Generar tokens
    const accessToken = generateAccessToken(user.id, user.email);
    const refreshToken = generateRefreshToken(user.id);
    await saveRefreshToken(user.id, refreshToken);
    
    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        organizationId: user.organization_id,
      },
      accessToken,
      refreshToken,
    };
  }
  
  /**
   * Refresca el access token usando un refresh token
   */
  async refreshToken(refreshToken) {
    // Verificar que el token sea válido
    const isValid = await isRefreshTokenValid(refreshToken);
    
    if (!isValid) {
      throw new Error('Invalid or expired refresh token');
    }
    
    // Decodificar token
    const decoded = verifyRefreshToken(refreshToken);
    
    // Obtener información del usuario
    const result = await query(
      'SELECT id, email FROM users WHERE id = $1 AND is_active = true',
      [decoded.userId]
    );
    
    if (result.rows.length === 0) {
      throw new Error('User not found or inactive');
    }
    
    const user = result.rows[0];
    
    // Generar nuevo access token
    const newAccessToken = generateAccessToken(user.id, user.email);
    
    return {
      accessToken: newAccessToken,
    };
  }
  
  /**
   * Logout de usuario
   */
  async logout(refreshToken) {
    if (refreshToken) {
      await revokeRefreshToken(refreshToken);
    }
    
    return { message: 'Logged out successfully' };
  }
  
  /**
   * Obtiene información del usuario actual
   */
  async getCurrentUser(userId) {
    const result = await query(
      `SELECT u.id, u.email, u.full_name, u.organization_id,
              u.created_at, u.google_access_token IS NOT NULL as has_google_auth,
              o.name as organization_name,
              array_agg(DISTINCT r.name) as roles,
              array_agg(DISTINCT p.name) as permissions
       FROM users u
       LEFT JOIN organizations o ON u.organization_id = o.id
       LEFT JOIN user_roles ur ON u.id = ur.user_id
       LEFT JOIN roles r ON ur.role_id = r.id
       LEFT JOIN role_permissions rp ON r.id = rp.role_id
       LEFT JOIN permissions p ON rp.permission_id = p.id
       WHERE u.id = $1
       GROUP BY u.id, o.name`,
      [userId]
    );
    
    if (result.rows.length === 0) {
      throw new Error('User not found');
    }
    
    const user = result.rows[0];
    
    return {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      organizationId: user.organization_id,
      organizationName: user.organization_name,
      hasGoogleAuth: user.has_google_auth,
      roles: user.roles.filter(r => r !== null),
      permissions: user.permissions.filter(p => p !== null),
      createdAt: user.created_at,
    };
  }
  
  /**
   * Cambia la contraseña del usuario
   */
  async changePassword(userId, currentPassword, newPassword) {
    // Obtener contraseña actual
    const result = await query(
      'SELECT password_hash FROM users WHERE id = $1',
      [userId]
    );
    
    if (result.rows.length === 0) {
      throw new Error('User not found');
    }
    
    const { password_hash } = result.rows[0];
    
    // Verificar contraseña actual
    const isPasswordValid = await bcrypt.compare(currentPassword, password_hash);
    
    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }
    
    // Hash de la nueva contraseña
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    
    // Actualizar contraseña
    await query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [newPasswordHash, userId]
    );
    
    return { message: 'Password changed successfully' };
  }
}

export default new AuthService();