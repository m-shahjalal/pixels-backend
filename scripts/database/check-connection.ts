// scripts/database/check-connection.ts
import { DataSource } from 'typeorm';
import { datasource } from '../../src/database/data-source';

async function checkConnection() {
  let connection: DataSource | null = null;

  try {
    connection = await datasource.initialize();
    console.log('✅ Database connection established successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) await connection.destroy();
  }
}

// Run the check
checkConnection();
