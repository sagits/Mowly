/**
 * Jest project for this app, rooted here. It does not reach into `packages/`: the customer project already runs those tests.
 * `modulePaths` mirrors `metro.config.js`'s `nodeModulesPaths`: with the hoisted layout the app's
 * direct dependencies sit in this app's `node_modules`, which is not on a `packages/` file's lookup path.
 * `jest.setup.ts` is appended to the preset's own `setupFilesAfterEnv`, never replacing it.
 */
const path = require('path');

const expoPreset = require('jest-expo/jest-preset');

module.exports = {
  preset: 'jest-expo',
  rootDir: __dirname,
  roots: ['<rootDir>/app', '<rootDir>/src', '<rootDir>/tests'],
  setupFilesAfterEnv: [...(expoPreset.setupFilesAfterEnv ?? []), '<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  modulePaths: [path.resolve(__dirname, 'node_modules'), path.resolve(__dirname, '../../node_modules')],
  testTimeout: 30_000,
  passWithNoTests: true,
};
