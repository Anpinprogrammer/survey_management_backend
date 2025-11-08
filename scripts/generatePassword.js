import bcrypt from 'bcrypt';

/**
 * Script para generar hash de contraseñas
 * Uso: node scripts/generatePassword.js "MiContraseña123"
 */

const password = process.argv[2];

if (!password) {
  console.error('❌ Error: Debes proporcionar una contraseña');
  console.log('Uso: node scripts/generatePassword.js "MiContraseña123"');
  process.exit(1);
}

async function generateHash() {
  try {
    const hash = await bcrypt.hash(password, 10);
    
    console.log('\n✅ Hash generado exitosamente:');
    console.log('─────────────────────────────────────────────────────────');
    console.log(`Password: ${password}`);
    console.log(`Hash:     ${hash}`);
    console.log('─────────────────────────────────────────────────────────\n');
    
    // Verificar que el hash funciona
    const isValid = await bcrypt.compare(password, hash);
    console.log(`✓ Verificación: ${isValid ? 'OK' : 'FAILED'}\n`);
  } catch (error) {
    console.error('❌ Error generando hash:', error);
    process.exit(1);
  }
}

generateHash();