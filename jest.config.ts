import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    'node_modules/variables/.+\\.(j|t)sx?$': 'ts-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!variables/.*)',
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    './src/**',
    '!./src/Service/EventListener/buttonEventListeners.ts', // This file makes coverage to crash
  ],
};

export default config;
