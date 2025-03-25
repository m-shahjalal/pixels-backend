import * as fs from 'fs';
import { Loader } from './loader';
import { promisify } from 'util';
import { exec } from 'child_process';

// Console logging with emojis
export const log = {
  info: (message: string, icon?: string) =>
    console.info(`${icon ? icon : 'ℹ️'}  ${message}`),
  success: (message: string) => console.info(`🎉 ${message}`),
  warning: (message: string) => console.info(`🌕  ${message}`),
  error: (message: string) => console.info(`❌ ${message}`),
  process: (message: string) => console.info(`🔄 ${message}`),
  database: (message: string) => console.info(`🛢️  ${message}`),
  file: (message: string) => console.info(`📄 ${message}`),
  question: (message: string) => `❓ ${message}`,
  danger: (message: string) => `🔴 ${message}`,
  command: (message: string) => console.info(`🔧 ${message}`),
  plain: (message: string) => console.info(message),
  table: customConsoleTable,

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
// Check if a directory exists and create it if not
export const ensureDirExists = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    log.info(`Created directory: ${dir}`);
  }
};

function customConsoleTable(data: any[], title: string = '') {
  if (!data || !data.length) return console.info('No data to display.');
  const keys = Object.keys(data[0]);

  // ANSI color codes
  const BOLD = '\x1b[1m';
  const CYAN = '\x1b[36m';
  const GREEN = '\x1b[32m';
  const RESET = '\x1b[0m';

  // Border characters
  const TOP_LEFT = '┌';
  const TOP_RIGHT = '┐';
  const BOTTOM_LEFT = '└';
  const BOTTOM_RIGHT = '┘';
  const HORIZONTAL = '─';
  const VERTICAL = '│';
  const TOP_JUNCTION = '┬';
  const BOTTOM_JUNCTION = '┴';
  const LEFT_JUNCTION = '├';
  const RIGHT_JUNCTION = '┤';
  const CROSS_JUNCTION = '┼';

  // Calculate the maximum width needed for each column
  const columnWidths = {};
  keys.forEach((key) => {
    columnWidths[key] = key.length;
    data.forEach((row) => {
      const valueStr = String(row[key]);
      if (valueStr.length > columnWidths[key]) {
        columnWidths[key] = valueStr.length;
      }
    });
  });

  // Calculate total table width
  const totalWidth = keys.reduce((s, k) => s + columnWidths[k] + 3, 0) - 1;

  // Display title if provided
  if (title) {
    const titleBorder = TOP_LEFT + HORIZONTAL.repeat(totalWidth) + TOP_RIGHT;
    console.info(titleBorder);

    const centeredTitle = title
      .padStart(Math.floor((totalWidth - title.length) / 2) + title.length)
      .padEnd(totalWidth);

    console.info(VERTICAL + BOLD + GREEN + centeredTitle + RESET + VERTICAL);

    const titleBottomBorder =
      LEFT_JUNCTION + HORIZONTAL.repeat(totalWidth) + RIGHT_JUNCTION;
    console.info(titleBottomBorder);
  } else {
    // Create top border without title
    let topBorder = TOP_LEFT;
    keys.forEach((key, index) => {
      topBorder += HORIZONTAL.repeat(columnWidths[key] + 2);
      topBorder += index < keys.length - 1 ? TOP_JUNCTION : TOP_RIGHT;
    });
    console.info(topBorder);
  }

  // Create the header row with bold and color
  let headerRow = `${VERTICAL} `;
  keys.forEach((key, index) => {
    headerRow +=
      BOLD +
      CYAN +
      key.padEnd(columnWidths[key]) +
      RESET +
      ' ' +
      VERTICAL +
      (index < keys.length - 1 ? ' ' : '');
  });
  console.info(headerRow);

  // Create header-data separator
  let headerSeparator = LEFT_JUNCTION;
  keys.forEach((key, index) => {
    headerSeparator += HORIZONTAL.repeat(columnWidths[key] + 2);
    headerSeparator +=
      index < keys.length - 1 ? CROSS_JUNCTION : RIGHT_JUNCTION;
  });
  console.info(headerSeparator);

  // Print each data row
  data.forEach((row, rowIndex) => {
    let rowStr = `${VERTICAL} `;
    keys.forEach((key, index) => {
      const value = String(row[key]);
      rowStr +=
        value.padEnd(columnWidths[key]) +
        ' ' +
        VERTICAL +
        (index < keys.length - 1 ? ' ' : '');
    });
    console.info(rowStr);

    // Add row separator except after the last row
    if (rowIndex >= data.length - 1) return;

    let rowSeparator = LEFT_JUNCTION;
    keys.forEach((key, index) => {
      rowSeparator += HORIZONTAL.repeat(columnWidths[key] + 2);
      rowSeparator += index < keys.length - 1 ? CROSS_JUNCTION : RIGHT_JUNCTION;
    });
    console.info(rowSeparator);
  });

  // Create bottom border
  let bottomBorder = BOTTOM_LEFT;
  keys.forEach((key, index) => {
    bottomBorder += HORIZONTAL.repeat(columnWidths[key] + 2);
    bottomBorder += index < keys.length - 1 ? BOTTOM_JUNCTION : BOTTOM_RIGHT;
  });
  console.info(bottomBorder);
}

export const execAsync = promisify(exec);
