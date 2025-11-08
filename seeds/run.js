import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../src/config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runSeeds() {
  const client = await pool.connect();
  
  try {
    console.log('🌱 Starting database seeding...\n');
    
    // Leer todos los archivos SQL en el directorio seeds
    const seedsDir = __dirname;
    const files = fs.readdirSync(seedsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    for (const file of files) {
      console.log(`📄 Running seed: ${file}`);
      const filePath = path.join(seedsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      await client.query(sql);
      console.log(`✅ Seed completed: ${file}\n`);
    }
    
    console.log('🎉 All seeds completed successfully!');
    console.log('\n📝 Demo credentials:');
    console.log('   Email: admin@demo.com');
    console.log('   Password: Admin123!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runSeeds()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));