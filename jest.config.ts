import { readFileSync } from 'fs';
import Module from 'module';

const origResolveFilename = (Module as any)._resolveFilename;
(Module as any)._resolveFilename = function (request: string, parent: unknown, isMain: boolean, options: unknown) {
  if (request === 'typescript') {
    return origResolveFilename.call(this, '@typescript/typescript6', parent, isMain, options);
  }
  return origResolveFilename.call(this, request, parent, isMain, options);
};

const { pathsToModuleNameMapper } = await import('ts-jest');
const { compilerOptions } = JSON.parse(readFileSync('./tsconfig.json', 'utf8'));
const { '*': _wildcard, ...aliasPaths } = compilerOptions.paths;

export default {
  maxWorkers: 1,
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { compiler: '@typescript/typescript6' }],
  },
  modulePaths: ['<rootDir>/src'],
  moduleNameMapper: pathsToModuleNameMapper(aliasPaths, { prefix: '<rootDir>/' }),
};
