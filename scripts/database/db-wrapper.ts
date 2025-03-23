#!/usr/bin/env ts-node
import * as path from 'path';
import * as child_process from 'child_process';

// Determine if running locally (not in Docker)
const isRunningLocally =
  !process.env.DOCKER_ENV && process.env.APP_ENV !== 'production';

// If running locally, modify environment variables for database connection
if (isRunningLocally) {
  console.log('🔧 Running locally, adjusting database connection settings...');
  process.env.DB_HOST = 'localhost';
  process.env.DB_SYNCHRONIZE = 'false'; // Prevent synchronization issues
}

// Forward all arguments to the original CLI script
const args = process.argv.slice(2);
const cliPath = path.resolve(__dirname, 'cli.ts');

try {
  // Run the CLI script with the modified environment
  const result = child_process.spawnSync(
    'ts-node',
    ['-r', 'tsconfig-paths/register', cliPath, ...args],
    {
      stdio: 'inherit',
      env: process.env,
    },
  );

  process.exit(result.status || 0);
} catch (error) {
  console.error('Error executing database command:', error.message);
  process.exit(1);
}
