const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/e2e/',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    'react-markdown': '<rootDir>/src/components/__mocks__/react-markdown.tsx',
    'remark-gfm': '<rootDir>/src/components/__mocks__/remark-gfm.js',
    'remark-breaks': '<rootDir>/src/components/__mocks__/remark-breaks.js',
    'rehype-raw': '<rootDir>/src/components/__mocks__/remark-gfm.js',
    'rehype-highlight': '<rootDir>/src/components/__mocks__/remark-gfm.js',
    'react-syntax-highlighter/dist/cjs/styles/prism': '<rootDir>/src/components/__mocks__/prism-react-renderer.tsx',
    'react-syntax-highlighter/dist/esm/styles/prism': '<rootDir>/src/components/__mocks__/prism-react-renderer.tsx',
    'react-syntax-highlighter': '<rootDir>/src/components/__mocks__/prism-react-renderer.tsx',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(remark-breaks|remark-gfm|rehype-raw|rehype-highlight|unified|bail|is-plain-obj|trough|vfile|vfile-message|unist-util-stringify-position|mdast-util-to-string|micromark|decode-named-character-reference|character-entities|property-information|space-separated-tokens|comma-separated-tokens|hast-util-whitespace)/)',
  ],
}

module.exports = createJestConfig(customJestConfig)
