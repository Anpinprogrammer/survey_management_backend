import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4, // genera automáticamente el UUID
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  full_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  organization_id: {
    type: DataTypes.UUID,
    references: {
      model: 'organizations', // nombre de la tabla referenciada
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  google_access_token: {
    type: DataTypes.TEXT,
  },
  google_refresh_token: {
    type: DataTypes.TEXT,
  },
  google_token_expiry: {
    type: DataTypes.DATE,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'users',
  timestamps: false, // desactivamos timestamps automáticos de Sequelize
});

export default User;
