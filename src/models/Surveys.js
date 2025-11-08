/**-- Tabla de encuestas
CREATE TABLE surveys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    google_form_id VARCHAR(255) NOT NULL,
    google_form_url TEXT NOT NULL,
    google_response_url TEXT,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    created_by UUID REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'draft',
    is_internal BOOLEAN DEFAULT false,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);*/

import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

const Surveys = sequelize.define('Surveys', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    google_form_id: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    google_form_url: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    google_response_url : {
        type: DataTypes.TEXT,
        allowNull: true
    },
    organization_id: {
        type: DataTypes.UUID,
        references: {
            model: 'organizations',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    created_by: {
        type: DataTypes.UUID,
        references: {ç,
            model: 'users',
            key: 'id'
        }
    }, 
    status: {
        type: DataTypes.STRING(50),
        defaultValue: 'draft'
    },
    is_internal: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    settings: {
        type: DataTypes.JSONB,
        defaultValue: '{}'
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}, {
    tableName: 'surveys',
    timestamps: false,

    // 👇 Aquí defines los índices
    indexes: [
      {
        name: 'idx_surveys_organization',
        fields: ['organization_id'],
      },
      {
        name: 'idx_surveys_created_by',
        fields: ['created_by'],
      },
      {
        name: 'idx_surveys_status',
        fields: ['status'],
      },
    ],
});

export default Surveys;