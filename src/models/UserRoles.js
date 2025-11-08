/**-- Relación usuarios-roles
CREATE TABLE user_roles (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by UUID REFERENCES users(id),
    PRIMARY KEY (user_id, role_id)
);*/
import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

const UserRoles = sequelize.define('UserRoles', {
    user_id : {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
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
    assigned_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    assigned_by: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        },
    },
}, {
    tableName: 'user_roles',
    timestamps: false,
})

export default UserRoles