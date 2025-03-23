#!/usr/bin/env node
import { Command } from 'commander';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { config } from 'dotenv';
import { getCommand, log } from './utils/etc';
import { runTypeOrmCommand } from './utils/run-orm-command';
import { validateDbConnection } from './utils/run-orm-command';

// Load environment variables
config();

const execAsync = promisify(exec);
const program = new Command();

// Data source path
const MIGRATIONS_DIR = './src/database/migrations';
const SEEDS_DIR = './src/database/seeds';

// Ensure directories exist
const ensureDirExists = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    log.info(`Created directory: ${dir}`);
  }
};

// Database migration commands
program
  .command('migration:generate')
  .description('Generate a new migration file')
  .argument('<name>', 'Name of the migration')
  .option('-d, --dry-run', 'Show the migration SQL without executing it')
  .action(async (name, options) => {
    ensureDirExists(path.dirname(MIGRATIONS_DIR));

    // Validate migration name
    if (!/^[a-zA-Z0-9-_]+$/.test(name)) {
      log.error(
        'Migration name must contain only letters, numbers, hyphens and underscores',
      );
      process.exit(1);
    }

    const args = [`${MIGRATIONS_DIR}/${name}`];
    if (options.dryRun) args.push('--dry-run');

    await runTypeOrmCommand('migration:generate', args);
  });

program
  .command('migration:create')
  .description('Create a new empty migration file')
  .argument('<name>', 'Name of the migration')
  .action(async (name) => {
    ensureDirExists(path.dirname(MIGRATIONS_DIR));

    // Validate migration name
    if (!/^[a-zA-Z0-9-_]+$/.test(name)) {
      log.error(
        'Migration name must contain only letters, numbers, hyphens and underscores',
      );
      process.exit(1);
    }

    await runTypeOrmCommand('migration:create', [`${MIGRATIONS_DIR}/${name}`]);
  });

program
  .command('migration:run')
  .description('Run all pending migrations')
  .option('-t, --transaction', 'Run migrations in a transaction')
  .action(async (options) => {
    const args = [];
    if (options.transaction) args.push('--transaction');

    await runTypeOrmCommand('migration:run', args);
  });

program
  .command('migration:revert')
  .description('Revert the most recent migration')
  .action(async () => {
    await runTypeOrmCommand('migration:revert');
  });

program
  .command('migration:show')
  .description('Show all migrations and whether they are applied')
  .action(async () => {
    await runTypeOrmCommand('migration:show');
  });

// Database seeding commands
program
  .command('seed:run')
  .description('Run database seeds')
  .option(
    '-e, --env <environment>',
    'Environment to run seeds for (dev, test, prod)',
    'dev',
  )
  .option('-s, --specific <seed>', 'Run a specific seed file')
  .action(async (options) => {
    let seedCommand = `ts-node -r tsconfig-paths/register ./scripts/database/seed.ts --env=${options.env}`;

    if (options.specific) {
      // Validate seed file name
      if (!/^[a-zA-Z0-9-_.]+$/.test(options.specific)) {
        log.error(
          'Seed file name must contain only letters, numbers, hyphens, underscores and dots',
        );
        process.exit(1);
      }

      seedCommand += ` --seed=${options.specific}`;
    }

    try {
      const loader = log.startLoader(
        `Running seeds for ${options.env} environment...`,
      );
      const { stdout, stderr } = await execAsync(seedCommand);
      loader.stop(
        '✅',
        `Seeds for ${options.env} environment completed successfully`,
      );
      if (stderr) log.error(stderr);
      log.info(stdout);
    } catch (error) {
      log.error(`Error running seeds: ${error.message}`);
      process.exit(1);
    }
  });

program
  .command('seed:create')
  .description('Create a new seed file')
  .argument('<name>', 'Name of the seed file')
  .action((name) => {
    ensureDirExists(SEEDS_DIR);

    // Validate seed name
    if (!/^[a-zA-Z0-9-_]+$/.test(name)) {
      log.error(
        'Seed name must contain only letters, numbers, hyphens and underscores',
      );
      process.exit(1);
    }

    const fileName = `${name}.seed.ts`;
    const filePath = path.join(SEEDS_DIR, fileName);

    if (fs.existsSync(filePath)) {
      log.error(`Seed file ${fileName} already exists!`);
      process.exit(1);
    }

    const seedTemplate = `import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { faker } from '@faker-js/faker';

export default class ${name.charAt(0).toUpperCase() + name.slice(1)}Seeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    // Add your seeding logic here
    // Example:
    // const repository = dataSource.getRepository(YourEntity);
    // await repository.save([
    //   { name: faker.person.fullName(), email: faker.internet.email() },
    // ]);
    
    console.info('✅ ${name} seeding completed');
  }
}
`;

    fs.writeFileSync(filePath, seedTemplate);
    log.success(`Created new seed file: ${filePath}`);
  });

// Database schema commands
program
  .command('schema:sync')
  .description(
    'Synchronize database schema with entity definitions (WARNING: may cause data loss)',
  )
  .option('-d, --dry-run', 'Show SQL that would be executed without running it')
  .action(async (options) => {
    const args = [];
    if (options.dryRun) args.push('--dry-run');

    log.warning(
      'WARNING: This operation might cause data loss. Use with caution!',
    );

    // Ask for confirmation unless it's a dry run
    if (!options.dryRun) {
      const readline = await import('readline').then((m) =>
        m.createInterface({
          input: process.stdin,
          output: process.stdout,
        }),
      );

      await new Promise<void>((resolve) => {
        readline.question(
          log.question(
            'Are you sure you want to synchronize the database schema? This may cause data loss. (y/N): ',
          ),
          async (answer: string) => {
            readline.close();
            if (answer.toLowerCase() === 'y') {
              await runTypeOrmCommand('schema:sync', args);
            } else {
              log.info('Operation cancelled.');
            }
            resolve();
          },
        );
      });
    } else {
      await runTypeOrmCommand('schema:sync', args);
    }
  });

program
  .command('schema:drop')
  .description('Drop all tables in the database (DANGER: causes data loss)')
  .action(async () => {
    console.warn(
      log.danger(
        'DANGER: This operation will delete all data in the database!',
      ),
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
            await runTypeOrmCommand('schema:drop');
          } else {
            log.info('Operation cancelled.');
          }
          resolve();
        },
      );
    });
  });

// Database clean command
program
  .command('clean')
  .description('Clean all data from the database while preserving structure')
  .option(
    '-e, --exclude <tables>',
    'Comma-separated list of tables to exclude from cleaning',
  )
  .option(
    '-i, --include <tables>',
    'Comma-separated list of tables to include in cleaning (overrides exclude)',
  )
  .option('-y, --yes', 'Skip confirmation prompt')
  .action(async (options) => {
    log.warning(
      'WARNING: This operation will delete all data in the database while preserving the structure!',
    );
    if (!options.yes) {
      const readline = await import('readline').then((m) =>
        m.createInterface({
          input: process.stdin,
          output: process.stdout,
        }),
      );

      const confirmed = await new Promise<boolean>((resolve) => {
        readline.question(
          log.question(
            'Are you sure you want to clean all data from the database? Type "CLEAN" to confirm: ',
          ),
          (answer: string) => {
            readline.close();
            resolve(answer === 'CLEAN');
          },
        );
      });

      if (!confirmed) {
        log.info('Clean operation cancelled.');
        return;
      }
    }

    const isConnected = await validateDbConnection();
    if (!isConnected) {
      log.error('Aborting operation due to database connection failure.');
      process.exit(1);
    }

    try {
      const loader = log.startLoader('Retrieving table information...');
      const cmd = getCommand('clean');

      const args = [];
      if (options.exclude) args.push(`--exclude=${options.exclude}`);
      if (options.include) args.push(`--include=${options.include}`);

      const fullCmd = `${cmd} ${args.join(' ')}`;
      const { stdout, stderr } = await execAsync(fullCmd);
      loader.stop('✅', 'Clean operation completed successfully');

      if (stderr) console.error(stderr);
      log.info(stdout);
    } catch (error) {
      log.error(`Error cleaning database: ${error.message}`);
      process.exit(1);
    }
  });

// Database query commands
program
  .command('query:run')
  .description('Run a SQL query from a file')
  .argument('<file>', 'Path to SQL file')
  .action(async (file) => {
    if (!file.endsWith('.sql')) {
      log.error('File must have .sql extension');
      process.exit(1);
    }

    if (!fs.existsSync(file)) {
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
  });

// Database backup/restore
program
  .command('backup')
  .description('Create a database backup')
  .option(
    '-o, --output <path>',
    'Output file path',
    `./backup-${new Date().toISOString().replace(/:/g, '-')}.sql`,
  )
  .action(async (options) => {
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
  });

program
  .command('restore')
  .description('Restore a database from backup')
  .argument('<file>', 'Backup file path')
  .action(async (file) => {
    if (!fs.existsSync(file)) {
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
              const { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } =
                process.env;

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
  });

// Helper commands
program
  .command('info')
  .description('Display database information')
  .action(async () => {
    try {
      const loader = log.startLoader('Retrieving database information...');
      const cmd = getCommand('info');
      const { stdout, stderr } = await execAsync(cmd);
      loader.stop('✅', 'Database information retrieved successfully');

      if (stderr) log.error(stderr);
      log.info(stdout);
    } catch (error) {
      log.error(`Error retrieving database info: ${error.message}`);
      process.exit(1);
    }
  });

program.parse(process.argv);
