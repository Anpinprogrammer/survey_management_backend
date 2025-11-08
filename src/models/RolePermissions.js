/**-- Relación roles-permisos
CREATE TABLE role_permissions (
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);*/

import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

const RolePermissions = sequelize.define('RolePermissions', {
    role_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'roles',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    permission_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'permissions',
            key: 'id'
        },
        onDelete: 'CASCADE'
    }
});

export default RolePermissions;