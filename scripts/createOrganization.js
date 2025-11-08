import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcrypt';
import { query, getClient } from '../src/config/database.js';

/**
 * Script para crear una nueva organización con su administrador
 * Uso: node scripts/createOrganization.js
 */

import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function createOrganization() {
  console.log('\n🏢 Crear Nueva Organización\n');
  console.log('════════════════════════════════════════════════════\n');
  
  try {
    // Solicitar información
    const orgName = await ask('Nombre de la organización: ');
    const subdomain = await ask('Subdominio (ej: empresa): ');
    const adminName = await ask('Nombre del administrador: ');
    const adminEmail = await ask('Email del administrador: ');
    const adminPassword = await ask('Contraseña del administrador: ');
    
    rl.close();
    
    // Validaciones básicas
    if (!orgName || !subdomain || !adminName || !adminEmail || !adminPassword) {
      throw new Error('Todos los campos son obligatorios');
    }
    
    if (adminPassword.length < 8) {
      throw new Error('La contraseña debe tener al menos 8 caracteres');
    }
    
    const client = await getClient();
    
    try {
      await client.query('BEGIN');
      
      // 1. Crear organización
      console.log('\n📝 Creando organización...');
      const orgResult = await client.query(
        `INSERT INTO organizations (name, subdomain)
         VALUES ($1, $2)
         RETURNING id, name, subdomain`,
        [orgName, subdomain]
      );
      
      const organization = orgResult.rows[0];
      console.log(`✅ Organización creada: ${organization.name} (${organization.subdomain})`);
      
      // 2. Crear roles del sistema para esta organización
      console.log('📝 Creando roles del sistema...');
      const rolesData = [
        ['Admin', 'Administrador de la organización', true],
        ['Survey Creator', 'Puede crear y gestionar encuestas', true],
        ['Viewer', 'Solo puede ver resultados', true]
      ];
      
      const roleIds = {};
      
      for (const [name, description, isSystem] of rolesData) {
        const roleResult = await client.query(
          `INSERT INTO roles (name, description, organization_id, is_system_role)
           VALUES ($1, $2, $3, $4)
           RETURNING id, name`,
          [name, description, organization.id, isSystem]
        );
        
        roleIds[name] = roleResult.rows[0].id;
        console.log(`  ✓ Rol creado: ${name}`);
      }
      
      // 3. Asignar permisos a los roles
      console.log('📝 Asignando permisos...');
      
      // Admin - todos los permisos excepto manage_roles
      await client.query(
        `INSERT INTO role_permissions (role_id, permission_id)
         SELECT $1, id FROM permissions
         WHERE name IN (
           'manage_users', 'view_users', 'assign_roles',
           'create_survey', 'edit_survey', 'delete_survey',
           'view_survey', 'view_results', 'export_results', 'share_survey'
         )`,
        [roleIds['Admin']]
      );
      
      // Survey Creator
      await client.query(
        `INSERT INTO role_permissions (role_id, permission_id)
         SELECT $1, id FROM permissions
         WHERE name IN (
           'create_survey', 'edit_survey', 'view_survey',
           'view_results', 'export_results', 'share_survey'
         )`,
        [roleIds['Survey Creator']]
      );
      
      // Viewer
      await client.query(
        `INSERT INTO role_permissions (role_id, permission_id)
         SELECT $1, id FROM permissions
         WHERE name IN ('view_survey', 'view_results')`,
        [roleIds['Viewer']]
      );
      
      console.log('  ✓ Permisos asignados correctamente');
      
      // 4. Crear usuario administrador
      console.log('📝 Creando usuario administrador...');
      const passwordHash = await bcrypt.hash(adminPassword, 10);
      
      const userResult = await client.query(
        `INSERT INTO users (email, password_hash, full_name, organization_id)
         VALUES ($1, $2, $3, $4)
         RETURNING id, email, full_name`,
        [adminEmail, passwordHash, adminName, organization.id]
      );
      
      const admin = userResult.rows[0];
      console.log(`✅ Usuario creado: ${admin.full_name} (${admin.email})`);
      
      // 5. Asignar rol Admin al usuario
      await client.query(
        `INSERT INTO user_roles (user_id, role_id)
         VALUES ($1, $2)`,
        [admin.id, roleIds['Admin']]
      );
      
      console.log('✅ Rol Admin asignado al usuario');
      
      await client.query('COMMIT');
      
      // Resumen
      console.log('\n════════════════════════════════════════════════════');
      console.log('🎉 ¡Organización creada exitosamente!\n');
      console.log('📊 Detalles:');
      console.log(`   Organización: ${organization.name}`);
      console.log(`   Subdominio: ${organization.subdomain}`);
      console.log(`   ID: ${organization.id}\n`);
      console.log('👤 Administrador:');
      console.log(`   Nombre: ${admin.full_name}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Contraseña: ${adminPassword}`);
      console.log('\n📝 Roles creados:');
      console.log('   - Admin');
      console.log('   - Survey Creator');
      console.log('   - Viewer');
      console.log('════════════════════════════════════════════════════\n');
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
  
  process.exit(0);
}

createOrganization();