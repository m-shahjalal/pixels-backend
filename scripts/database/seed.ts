// scripts/database/seed.ts
import * as fs from 'fs';
import * as path from 'path';
import { DataSource } from 'typeorm';
import { datasource } from '../../src/database/data-source';
import { config } from 'dotenv';

// Load environment variables
config();

interface SeedOptions {
  env: string;
  seed?: string;
}

async function runSeeds() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  const options: SeedOptions = {
    env: 'dev',
  };

  for (const arg of args) {
    if (arg.startsWith('--env=')) {
      options.env = arg.replace('--env=', '');
    } else if (arg.startsWith('--seed=')) {
      options.seed = arg.replace('--seed=', '');
    }
  }

  console.log(`Running seeds for ${options.env} environment...`);
  if (options.seed) {
    console.log(`Running specific seed: ${options.seed}`);
  }

  let connection: DataSource | null = null;

  try {
    // Connect to database
    connection = await datasource.initialize();
    console.log('✅ Database connection established');

    const seedsDir = path.join(__dirname, 'seeds');

    if (!fs.existsSync(seedsDir)) {
      console.error(`Seeds directory not found: ${seedsDir}`);
      process.exit(1);
    }

    // Get seed files
    let seedFiles = fs
      .readdirSync(seedsDir)
      .filter((file) => file.endsWith('.seed.ts'))
      .sort();

    // Filter by specific seed if specified
    if (options.seed) {
      const specificSeed = options.seed.endsWith('.seed.ts')
        ? options.seed
        : `${options.seed}.seed.ts`;

      seedFiles = seedFiles.filter((file) => file === specificSeed);

      if (seedFiles.length === 0) {
        console.error(`Seed file not found: ${specificSeed}`);
        process.exit(1);
      }
    }

    // Run environment-specific seeds if not running a specific seed
    if (!options.seed) {
      const envSeedFiles = seedFiles.filter((file) =>
        file.includes(`.${options.env}.`),
      );

      if (envSeedFiles.length > 0) {
        console.log(
          `Found ${envSeedFiles.length} environment-specific seeds for ${options.env}`,
        );
        seedFiles = seedFiles.filter(
          (file) =>
            !file.includes('.dev.') &&
            !file.includes('.test.') &&
            !file.includes('.prod.'),
        );
        seedFiles = [...seedFiles, ...envSeedFiles];
      }
    }

    console.log(`Found ${seedFiles.length} seed files to run`);

    // Run each seed
    for (const file of seedFiles) {
      try {
        console.log(`Running seed: ${file}...`);
        const seedPath = path.join(seedsDir, file);
        const seedModule = await import(seedPath);
        const SeedClass = seedModule.default;

        if (!SeedClass) {
          console.warn(`No default export found in ${file}, skipping`);
          continue;
        }

        const seeder = new SeedClass();
        await seeder.run(connection);
        console.log(`✅ Seed ${file} completed successfully`);
      } catch (error) {
        console.error(`❌ Error running seed ${file}:`, error.message);
        throw error; // Re-throw to stop the seeding process
      }
    }

    console.log('All seeds completed successfully!');
  } catch (error) {
    console.error('❌ Error running seeds:', error.message);
    process.exit(1);
  } finally {
    if (connection) await connection.destroy();
  }
}

// Run the seeds
runSeeds();
