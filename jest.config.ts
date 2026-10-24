import { readFileSync } from 'fs';
import { pathsToModuleNameMapper } from 'ts-jest';

const { compilerOptions } = JSON.parse(readFileSync('./tsconfig.json', 'utf8'));

export default {
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
};
