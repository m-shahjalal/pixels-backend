#!/usr/bin/env node
import { Command } from 'commander';
import { config } from 'dotenv';
import * as action from './actions';

config();
const program = new Command();

// Database migration commands
program
  .command('migration:generate')
  .description('Generate a new migration file')
  .argument('[name]', '(optional, auto-generated if not provided)')
  .option('-d, --dry-run', 'Show the migration SQL without executing it')
  .option('--show-queries', 'Show SQL queries being executed')
  .action(action.generateMigration);

program
  .command('migration:create')
  .description('Create a new empty migration file')
  .argument('<name>', 'Name of the migration')
  .option('--show-queries', 'Show SQL queries being executed')
  .action(action.createMigration);

program
  .command('migration:run')
  .description('Run all pending migrations')
  .option('-t, --transaction', 'Run migrations in a transaction')
  .option('--show-queries', 'Show SQL queries being executed')
  .action(action.runMigration);

program
  .command('migration:revert')
  .description('Revert the most recent migration')
  .option('--show-queries', 'Show SQL queries being executed')
  .action(action.revertMigration);

program
  .command('migration:show')
  .description('Show all migrations and whether they are applied')
  .option('--show-queries', 'Show the queries that would be executed')
  .action(action.showMigration);

// Database seeding commands
program
  .command('seed:run')
  .description('Run database seeds')
  .option('-e, --env <environment>', 'Run seeds for (dev, test, prod)', 'dev')
  .option('-s, --specific <seed>', 'Run a specific seed file')
  .action(action.runSeed);

program
  .command('seed:create')
  .description('Create a new seed file')
  .argument('<name>', 'Name of the seed file')
  .action(action.createSeed);

// Database schema commands
program
  .command('schema:sync')
  .description('Synchronize schema with entity (WARNING: may cause data loss)')
  .option('-d, --dry-run', 'Show SQL that would be executed without running it')
  .option('--show-queries', 'Show SQL queries being executed')
  .action(action.syncSchema);

program
  .command('schema:drop')
  .description('Drop all tables in the database (DANGER: causes data loss)')
  .option('--show-queries', 'Show SQL queries being executed')
  .action(action.dropSchema);

// Database clean command
program
  .command('clean')
  .description('Clean all data from the database while preserving structure')
  .option('-e, --exclude <tables>', 'Comma-separated list for excluded tables')
  .option('-i, --include <tables>', 'Comma-separated list for included tables')
  .option('-y, --yes', 'Skip confirmation prompt')
  .action(action.cleanSchema);

// Database query commands
program
  .command('query:run')
  .description('Run a SQL query from a file')
  .argument('<file>', 'Path to SQL file')
  .action(action.runQuery);

// Database backup/restore
program
  .command('backup')
  .description('Create a database backup')
  .option('-o, --output <path>', 'Output file path', 'backup_<timestamp>.sql')
  .action(action.backupDB);

program
  .command('restore')
  .description('Restore a database from backup')
  .argument('<file>', 'Backup file path')
  .action(action.restoreDB);

// Helper commands
program
  .command('info')
  .description('Display database information')
  .option('--show-queries', 'Show SQL queries being executed')
  .action(action.dbInfo);

program.parse(process.argv);
