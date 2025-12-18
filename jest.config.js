const path = require('path')
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  rootDir: __dirname,
  testEnvironment: 'jest-environment-jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'mjs', 'cjs', 'json', 'node'],
  moduleNameMapper: {
    '^@/(.*)$': path.join(__dirname, 'src/$1'),
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  resolver: '<rootDir>/jest.resolver.js',
}

module.exports = createJestConfig(customJestConfig)
