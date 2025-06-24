module.exports = {
  preset: 'ts-jest',
  // testEnvironment: 'jsdom',
  // testMatch: ['tests/**.test.ts'],
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'js','jsx','tsx','json'],
  transform: {
    '^.+\\.(ts|tsx|jsx)$': 'ts-jest',
  },
  roots: ['<rootDir>/tests'],
};