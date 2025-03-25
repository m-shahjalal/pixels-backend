// scripts/database/run-query.ts
import * as fs from 'fs';
import { DataSource } from 'typeorm';
import { datasource } from '../../src/database/data-source';
import { log } from './utils/etc';

async function runQuery() {
  const filePath = process.argv[2];

  if (!filePath) {
    console.error('No SQL file specified');
    process.exit(1);
  }

  let connection: DataSource | null = null;

  try {
    // Read SQL from file
    const sql = fs.readFileSync(filePath, 'utf8');

    // Connect to database
    connection = await datasource.initialize();
    log.success('Database connection established');

    // Execute query
    log.process('Executing SQL query...');
    const queryRunner = connection.createQueryRunner();
    const result = await queryRunner.query(sql);

    log.success('Query executed successfully!');
    log.info('Result:', JSON.stringify(result, null, 2));

    return result;
  } catch (error) {
    console.error('❌ Error executing query:', error.message);
  } finally {
    if (connection) await connection.destroy();
    process.exit(1);
  }
}

// Run the query
runQuery();
