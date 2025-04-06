import tsConfig from './tsconfig.json';
import moduleAlias from 'module-alias';

// Extract path mappings from tsconfig
const paths = tsConfig.compilerOptions.paths;

// Register path aliases for runtime
Object.keys(paths).forEach((alias) => {
  const aliasPath = paths[alias][0].replace(/\/\*$/, '');
  moduleAlias.addAlias(alias.replace(/\/\*$/, ''), `${__dirname}/${aliasPath}`);
});
