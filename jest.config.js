module.exports = {
  collectCoverageFrom: [
    'src/**/*.ts'
  ],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/'
  ],
  coverageReporters: [
    'lcov'
  ],
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/test/tsconfig.json',
    }
  },
  moduleDirectories: [
    'node_modules',
    'src',
    'test/unit'
  ],
  preset: 'ts-jest',
  roots: [
    '<rootDir>/src',
    '<rootDir>/test'
  ],
  testEnvironment: 'node'
};
