import { Loader } from './loader';

// Console logging with emojis
export const log = {
  info: (message: string) => console.log(`ℹ️  ${message}`),
  success: (message: string) => console.log(`✅ ${message}`),
  warning: (message: string) => console.warn(`⚠️  ${message}`),
  error: (message: string) => console.error(`❌ ${message}`),
  process: (message: string) => console.log(`🔄 ${message}`),
  database: (message: string) => console.log(`🛢️  ${message}`),
  file: (message: string) => console.log(`📄 ${message}`),
  question: (message: string) => `❓ ${message}`,
  danger: (message: string) => `🔴 ${message}`,
  command: (message: string) => console.log(`⚙️  ${message}`),

  // Loader methods
  startLoader: (message: string): Loader => {
    const loader = new Loader(message);
    loader.start();
    return loader;
  },
};

// Get the full command to run a script
export const getCommand = (path: string, args: string[] = []) => {
  return `ts-node -r tsconfig-paths/register ./scripts/database/${path}.ts ${args.join(' ')}`;
};
