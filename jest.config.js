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
    'react-syntax-highlighter/dist/cjs/styles/prism': '<rootDir>/src/components/__mocks__/prism-react-renderer.tsx',
    'react-syntax-highlighter': '<rootDir>/src/components/__mocks__/prism-react-renderer.tsx',
  },
}

module.exports = createJestConfig(customJestConfig)