import { log } from '../utils/etc';
import { runTypeOrmCommand } from '../utils/run-orm-command';
import { datasource } from '../../../src/database/data-source';

export const syncSchema = async (options) => {
  const args = [];
  if (options.dryRun) args.push('--dry-run');

  log.warning(
    'WARNING: This operation might cause data loss. Use with caution!',
  );

  // Ask for confirmation unless it's a dry run
  if (options.dryRun) {
    await runTypeOrmCommand('schema:sync', args, {
      showQueries: options.showQueries === true,
    });
  } else {
    const readline = await import('readline').then((m) =>
      m.createInterface({ input: process.stdin, output: process.stdout }),
    );

    await new Promise<void>((resolve) => {
      readline.question(
        log.question('Are you sure to synchronize? May loss data. (y/N): '),
        async (answer: string) => {
          readline.close();
          if (answer.toLowerCase() === 'y') {
            await runTypeOrmCommand('schema:sync', args, {
              showQueries: options.showQueries === true,
            });
          } else {
            log.info('Operation cancelled.');
          }
          resolve();
        },
      );
    });
  }
};

export const dropSchema = async (options) => {
  console.warn(
    log.danger('DANGER: This operation will delete all data in the database!'),
  );

  const readline = await import('readline').then((m) =>
    m.createInterface({
      input: process.stdin,
      output: process.stdout,
    }),
  );

  await new Promise<void>((resolve) => {
    readline.question(
      log.question(
        'Are you sure you want to drop all tables? This WILL cause data loss. Type "DROP" to confirm: ',
      ),
      async (answer: string) => {
        readline.close();
        if (answer === 'DROP') {
          await runTypeOrmCommand('schema:drop', [], {
            showQueries: options.showQueries === true,
          });
        } else {
          log.info('Operation cancelled.');
        }
        resolve();
      },
    );
  });
};

export const cleanSchema = async (options) => {
  log.warning('WARNING: This operation will delete all data in the database');

  log.info('🌱 CLEANING STARTED');

  try {
    // Initialize the data source
    const dataSource = await datasource.initialize();

    // Using the raw query runner for database cleanup operations
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();

      // Terminate all connections except our own
      await queryRunner.query(`
        SELECT pg_terminate_backend(pid)
        FROM pg_stat_activity
        WHERE pid <> pg_backend_pid()
        AND datname = current_database();
      `);

      // Drop all schemas (including public)
      await queryRunner.query(`
        DO $$ DECLARE
          r RECORD;
        BEGIN
          FOR r IN (SELECT nspname FROM pg_namespace WHERE nspname NOT LIKE 'pg_%' AND nspname != 'information_schema')
          LOOP
            EXECUTE 'DROP SCHEMA IF EXISTS ' || quote_ident(r.nspname) || ' CASCADE';
          END LOOP;
        END $$;
      `);

      // Recreate public schema
      await queryRunner.query(`CREATE SCHEMA public;`);

      // Reset search path
      await queryRunner.query(
        `SELECT set_config('search_path', 'public', false);`,
      );

      // Grant privileges back to public
      await queryRunner.query(`
        GRANT ALL ON SCHEMA public TO public;
        GRANT ALL ON ALL TABLES IN SCHEMA public TO public;
        GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO public;
      `);

      await queryRunner.commitTransaction();
      log.success('✅ DATABASE CLEANED SUCCESSFULLY');

      // Run TypeORM migration to recreate schema if the migrate option is enabled
      if (options.migrate) {
        log.info('🔄 Running migrations to recreate database schema...');
        const migrationResult = await runTypeOrmCommand('migration:run', [], {
          showQueries: false,
        });

        if (migrationResult) {
          log.success('✅ Database schema recreated successfully');
        } else {
          log.warning(
            '⚠️ Failed to recreate database schema. You may need to run migrations manually.',
          );
        }
      } else {
        log.info('Skipping migrations as requested');
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
      await dataSource.destroy();
    }
  } catch (error) {
    log.error(`Error cleaning database: ${error.message}`);
    process.exit(1);
  }
};
