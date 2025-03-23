import { promisify } from 'util';
import { log } from './etc';
import { exec } from 'child_process';
import { datasource } from '../../../src/database/data-source';

export const validateDbConnection = async () => {
  const execAsync = promisify(exec);

  const loader = log.startLoader('Validating database connection...');

  try {
    await execAsync(
      `ts-node -r tsconfig-paths/register ./scripts/database/check-connection.ts`,
    );
    loader.stop('✅', 'Database connection successful!');
    return true;
  } catch (error) {
    loader.stop('❌', 'Database connection failed!');
    console.error(error.message);
    return false;
  }
};

// Helper to run TypeORM CLI commands
export const runTypeOrmCommand = async (
  command: string,
  args: string[] = [],
) => {
  const isConnected = await validateDbConnection();
  const execAsync = promisify(exec);

  if (!isConnected) {
    log.error('Aborting operation due to database connection failure.');
    process.exit(1);
  }

  const cmd = `ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js ${command} ${args.join(' ')} -d ${datasource}`;
  log.command(`Running: ${cmd}`);

  const loader = log.startLoader(`Executing ${command} command...`);

  try {
    const { stdout, stderr } = await execAsync(cmd);
    loader.stop('✅', `${command} completed successfully`);
    if (stderr) console.error(stderr);
    console.log(stdout);
    return true;
  } catch (error) {
    loader.stop('❌', `Error executing ${command} command`);
    console.error(error.message);
    return false;
  }
};
