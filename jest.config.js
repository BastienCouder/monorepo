const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

/** @type {import('jest').Config} */
const config = {
  coverageProvider: 'v8',
  testMatch: ['**/__tests__/**/*.test.ts?(x)'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  preset: 'ts-jest',
  verbose: true,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '@/auth': '<rootDir>/__tests__/mocks/auth.ts',
    'next-auth/providers/credentials':
      '<rootDir>/__tests__/mocks/next-auth-providers-credentials.ts',
    'next-auth': '<rootDir>/__tests__/mocks/next-auth.ts',
  },
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.jest.json',
    },
  },
};

module.exports = createJestConfig(config);
