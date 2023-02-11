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
    // Aparently, files that use some Phaser components like 'Sprite' make coverage to fail
    './src/**',
    '!./src/index.ts',
    '!./src/Service/EventListener/{buttonEventListeners,gameItemEventListeners}.ts',
    '!./src/Scene/Main/Sprite/**',
    './src/Scene/Main/Sprite/Player/**',
    '!./src/Scene/Main/Sprite/Player/Player.ts',
  ],
};

export default config;
