import { existsSync, PathLike } from 'fs';
import { ensureDirExists, getCommand, log } from '../utils/etc';
import { execAsync } from '../utils/etc';
import path from 'path';
import { datasource } from '../../../src/database/data-source';
import { DataSource } from 'typeorm';

export const runQuery = async (file: string) => {
  if (!file.endsWith('.sql')) {
    log.error('File must have .sql extension');
    process.exit(1);
  }

  if (!existsSync(file)) {
    log.error(`File ${file} does not exist`);
    process.exit(1);
  }

  try {
    const loader = log.startLoader(`Executing SQL query from ${file}...`);
    const cmd = getCommand('run-query', [`"${file}"`]);
    const { stdout, stderr } = await execAsync(cmd);
    loader.stop('✅', 'Query executed successfully');

    if (stderr) log.error(stderr);
    log.info(stdout);
  } catch (error) {
    log.error(`Error executing query: ${error.message}`);
    process.exit(1);
  }
};

export const backupDB = async (options: { output: string }) => {
  try {
    const loader = log.startLoader(
      `Creating database backup to ${options.output}...`,
    );

    // Get database connection info from environment variables
    const { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } = process.env;

    if (!DB_HOST || !DB_PORT || !DB_USER || !DB_NAME) {
      loader.stop('❌', 'Missing required database environment variables');
      process.exit(1);
    }

    const backupDir = path.dirname(options.output);
    ensureDirExists(backupDir);

    // Create pg_dump command
    const cmd = `PGPASSWORD='${DB_PASS}' pg_dump -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d ${DB_NAME} -F c -f "${options.output}"`;

    // Hide password in console output
    log.command(
      `Running: ${cmd.replace(/PGPASSWORD='[^']*'/, "PGPASSWORD='***'")}}`,
    );

    const { stdout, stderr } = await execAsync(cmd);
    loader.stop('✅', 'Backup created successfully!');

    if (stderr) log.error(stderr);
    if (stdout) log.info(stdout);
  } catch (error) {
    log.error(`Error creating backup: ${error.message}`);
    process.exit(1);
  }
};

export const restoreDB = async (file: PathLike) => {
  if (!existsSync(file)) {
    log.error(`Backup file ${file} does not exist`);
    process.exit(1);
  }

  log.warning('WARNING: This operation will overwrite the current database!');

  const readline = await import('readline').then((m) =>
    m.createInterface({
      input: process.stdin,
      output: process.stdout,
    }),
  );

  await new Promise<void>((resolve) => {
    readline.question(
      log.question(
        'Are you sure you want to restore the database? This will overwrite current data. Type "RESTORE" to confirm: ',
      ),
      async (answer: string) => {
        readline.close();
        if (answer === 'RESTORE') {
          try {
            // Get database connection info from environment variables
            const { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } = process.env;

            if (!DB_HOST || !DB_PORT || !DB_USER || !DB_NAME) {
              log.error('Missing required database environment variables');
              process.exit(1);
            }

            const loader = log.startLoader(
              `Restoring database from ${file}...`,
            );

            // Create pg_restore command
            const cmd = `PGPASSWORD='${DB_PASS}' pg_restore -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d ${DB_NAME} -c "${file}"`;

            // Hide password in console output
            log.command(
              `Running: ${cmd.replace(/PGPASSWORD='[^']*'/, "PGPASSWORD='***'")}}`,
            );

            const { stdout, stderr } = await execAsync(cmd);
            loader.stop('✅', 'Database restored successfully!');

            if (stderr) log.error(stderr);
            if (stdout) log.info(stdout);
          } catch (error) {
            log.error(`Error restoring database: ${error.message}`);
            process.exit(1);
          }
        } else {
          log.info('Restore operation cancelled.');
        }
        resolve();
      },
    );
  });
};

export const dbInfo = async (options?: { showQueries?: boolean }) => {
  try {
    let connection: DataSource | null = null;
    const loader = log.startLoader('Retrieving database information...');
    const shouldShowQueries = options?.showQueries === true;

    const customDatasource = new DataSource({
      ...datasource.options,
      logging: shouldShowQueries,
    });

    connection = await customDatasource.initialize();
    const queryRunner = connection.createQueryRunner();

    // Get PostgreSQL version
    const versionResult = await queryRunner.query('SELECT version()');
    log.plain(
      `\n\n📊 Database Version: ${versionResult[0].version.split(' (')[0]}\n`,
    );

    // Get database size
    const sizeResult = await queryRunner.query(`
          SELECT pg_size_pretty(pg_database_size(current_database())) as database_size
        `);
    log.info(`Database Size: ${sizeResult[0].database_size}`, '💾');

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

    log.table(
      tablesResult.map(({ table_name, table_size }) => ({
        table_name,
        table_size,
      })),
      '📑 Tables',
    );

    const migrationsResult = await queryRunner.query(`
      SELECT 
        id, 
        timestamp, 
        name 
      FROM migrations 
      ORDER BY timestamp DESC
    `);
    log.table(
      migrationsResult.map((m: { id: any; name: any; timestamp: string }) => ({
        id: m.id,
        name: m.name,
        timestamp: new Date(parseInt(m.timestamp)).toISOString(),
      })),
      '📝 Migrations',
    );

    loader.stop('✅', 'Database information retrieved successfully');
    process.exit(0);
  } catch (error) {
    log.error(`Error retrieving database info: ${error.message}`);
    process.exit(1);
  }
};
