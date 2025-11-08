/**-- Tabla de organizaciones
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);*/
import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

const Organizations = sequelize.define('Organizations', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    subdomain: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    cerated_at : {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updated_at : {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}, {
    tableName: 'organizations',
    timestamps: false,
})

export default Organizations;