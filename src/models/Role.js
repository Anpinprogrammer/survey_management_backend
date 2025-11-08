import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Role = sequelize.define('Role', {
    id : {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Genera automaticamente el UUID 
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    organization_id: {
        type: DataTypes.UUID,
        references: {
            model: 'organizations',
            key: 'id',
        },
        onDelete: 'CASCADE'
    },
    is_system_role: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    }, {
        tableName: 'roles',
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['name', 'organization_id'],
            },
        ],
    }

);

export default Role;