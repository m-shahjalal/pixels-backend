import * as path from 'path';
import { ensureDirExists, log } from '../utils/etc';
import { runTypeOrmCommand } from '../utils/run-orm-command';

const MIGRATIONS_DIR = './src/database/migrations';

export const generateMigration = async (
  name: string,
  options: { dryRun: any; showQueries: boolean },
) => {
  ensureDirExists(path.dirname(MIGRATIONS_DIR));

  if (name) {
    if (!/^[a-zA-Z0-9-_]+$/.test(name)) {
      log.error(
        'Migration name must contain only letters, numbers, hyphens and underscores',
      );
      process.exit(1);
    }
  } else {
    const timestamp = new Date()
      .toISOString()
      .replace(/[\-:]/g, '')
      .replace(/\..+/, '');
    name = `migration-${timestamp}`;
    log.info(`No name provided, using auto-generated name: ${name}`);
  }

  const migrationPath = `${MIGRATIONS_DIR}/${name}`;
  const args = [migrationPath];
  if (options.dryRun) args.push('--dry-run');

  const result = await runTypeOrmCommand('migration:generate', args, {
    showQueries: options.showQueries === true,
  });

  if (result) {
    const fullPath = path.resolve(process.cwd(), migrationPath);
    log.info(`Migration file created at: ${fullPath}`, '📂');
  }
};

export const createMigration = async (
  name: string,
  options: { showQueries: boolean },
) => {
  ensureDirExists(path.dirname(MIGRATIONS_DIR));

  if (!/^[a-zA-Z0-9-_]+$/.test(name)) {
    log.error(
      'Migration name must contain only letters, numbers, hyphens and underscores',
    );
    process.exit(1);
  }

  await runTypeOrmCommand('migration:create', [`${MIGRATIONS_DIR}/${name}`], {
    showQueries: options.showQueries === true,
  });
};

export const runMigration = async (options: {
  transaction: any;
  showQueries: boolean;
}) => {
  const args = [];
  if (options.transaction) args.push('--transaction');

  await runTypeOrmCommand('migration:run', args, {
    showQueries: options.showQueries === true,
  });
};

export const revertMigration = async (options: { showQueries: boolean }) => {
  await runTypeOrmCommand('migration:revert', [], {
    showQueries: options.showQueries === true,
  });
};

export const showMigration = async (options) => {
  const args = [];
  if (options['show-queries']) args.push('--show-queries');

  await runTypeOrmCommand('migration:show', args, {
    showQueries: options.showQueries === true,
  });
};
