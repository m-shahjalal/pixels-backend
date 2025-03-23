// scripts/database/info.ts
import { DataSource } from 'typeorm';
import { datasource } from '../../src/database/data-source';

async function getDatabaseInfo() {
  let connection: DataSource | null = null;

  console.log('Getting database info.......................................');

  try {
    // Connect to database
    connection = await datasource.initialize();
    console.log('✅ Database connection established');

    // Get database info
    const queryRunner = connection.createQueryRunner();

    // Get PostgreSQL version
    const versionResult = await queryRunner.query('SELECT version()');
    console.log('\n📊 Database Version:');
    console.log(versionResult[0].version);

    // Get database size
    const sizeResult = await queryRunner.query(`
      SELECT pg_size_pretty(pg_database_size(current_database())) as database_size
    `);
    console.log('\n💾 Database Size:');
    console.log(sizeResult[0].database_size);

    // Get table list with row counts
    const tablesResult = await queryRunner.query(`
      SELECT 
        tablename AS table_name,
        pg_size_pretty(pg_total_relation_size('"' || tablename || '"')) as table_size,
        pg_total_relation_size('"' || tablename || '"') as raw_size
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY raw_size DESC
    `);

    console.log('\n📑 Tables:');
    console.table(
      tablesResult.map((t) => ({
        table_name: t.table_name,
        table_size: t.table_size,
      })),
    );

    // Get migration status
    console.log('\n🔄 Migration Status:');
    try {
      const migrationsResult = await queryRunner.query(`
        SELECT 
          id, 
          timestamp, 
          name 
        FROM migrations 
        ORDER BY timestamp DESC
      `);
      console.table(
        migrationsResult.map((m) => ({
          id: m.id,
          name: m.name,
          timestamp: new Date(parseInt(m.timestamp)).toISOString(),
        })),
      );
    } catch (error) {
      console.log('No migrations table found. Run migrations first.');
    }
  } catch (error) {
    console.error('❌ Error retrieving database info:', error.message);
    process.exit(1);
  } finally {
    if (connection) await connection.destroy();
  }
}

// Get database info
getDatabaseInfo();
