import { promisify } from 'util';
import { log } from './etc';
import { exec } from 'child_process';
import { DataSource } from 'typeorm';
import { datasource } from '../../../src/database/data-source';

export const validateDbConnection = async () => {
  let connection: DataSource | null = null;

  const loader = log.startLoader('⏳ Validating database connection...');

  try {
    connection = await datasource.initialize();
    loader.stop('⛓️‍💥', 'Database connection established');
    return true;
  } catch (error) {
    loader.stop('❌', `Database connection failed!${error.message}`);
    return false;
  } finally {
    if (connection) await connection.destroy();
  }
};

// Helper to run TypeORM CLI commands
export const runTypeOrmCommand = async (
  command: string,
  args: string[] = [],
  options?: { showQueries?: boolean },
) => {
  const isConnected = await validateDbConnection();
  const execAsync = promisify(exec);

  if (!isConnected) {
    log.error('Aborting operation due to database connection failure.');
    process.exit(1);
  }

  // Set environment variable to control query logging
  if (options?.showQueries === false) {
    process.env.TYPEORM_LOGGING = 'false';
  }

  const cmd = `ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js ${command} ${args.join(' ')} -d src/database/data-source.ts`;
  const loader = log.startLoader(`Executing ${command} command...`);

  try {
    const { stdout, stderr } = await execAsync(cmd);
    loader.stop('🎉', `command executed done 😎 \n`);
    if (stderr) console.error(stderr);
    if (
      stdout &&
      (options?.showQueries !== false || !stdout.includes('query:'))
    ) {
      console.info('\n', stdout);
    }
    return true;
  } catch (error) {
    loader.stop('❌', `Error executing ${command} command`);
    console.error(error.message);
    return false;
  }
};
