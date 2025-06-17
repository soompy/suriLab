const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    'react-markdown': '<rootDir>/src/components/__mocks__/react-markdown.tsx',
    'remark-gfm': '<rootDir>/src/components/__mocks__/remark-gfm.js',
  },
}

module.exports = createJestConfig(customJestConfig)