#!/usr/bin/env ts-node
import * as path from 'path';
import * as child_process from 'child_process';

const isRunningLocally =
  !process.env.DOCKER_ENV && process.env.APP_ENV !== 'production';

if (isRunningLocally) {
  process.env.DB_HOST = 'localhost';
  process.env.DB_SYNCHRONIZE = 'false';
}

const args = process.argv.slice(2);
const cliPath = path.resolve(__dirname, 'cli.ts');
const tsPath = path.resolve(process.cwd(), 'tsconfig.json');

try {
  // Execute the CLI command using ts-node
  console.info();
  const result = child_process.spawnSync(
    'ts-node',
    ['--project', tsPath, '-r', 'tsconfig-paths/register', cliPath, ...args],
    { stdio: 'inherit', env: process.env, cwd: process.cwd() },
  );

  process.exit(result.status || 0);
} catch (error) {
  console.error('Error executing database command:', error.message);
  process.exit(1);
}
