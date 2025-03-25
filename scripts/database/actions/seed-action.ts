import { ensureDirExists, log, execAsync } from '../utils/etc';
import * as fs from 'fs';
import * as path from 'path';

const SEEDS_DIR = './src/database/seeds';

export const runSeed = async (options) => {
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
};

export const createSeed = (name) => {
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
};
