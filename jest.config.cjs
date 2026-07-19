// Jest configuration for unit tests.
//
// Scope note: these unit tests deliberately cover the framework-agnostic
// logic modules and the small React hooks. Full component rendering, routing,
// and end-to-end user flows (LoginScreen, Terminal, pages, the interview
// capture flow, etc.) are intended to be exercised by Playwright, so they are
// intentionally left out of the coverage surface below.
module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.{js,jsx,ts,tsx}'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  // Stub out non-JS assets in case a tested module ever imports them.
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/test/styleMock.cjs',
    '\\.(png|jpe?g|gif|svg|webp|avif)$': '<rootDir>/test/fileMock.cjs',
  },

  // Only measure coverage on the surface these unit tests own; the rest is
  // Playwright's responsibility.
  collectCoverageFrom: [
    'src/lib/**/*.{js,ts}',
    'src/theme/**/*.js',
    'src/hooks/useCommandHistory.js',
    'src/hooks/useTerminalLog.js',
    'src/hooks/useAuth.js',
    'src/modules/interview/grading.js',
    'src/modules/interview/report.js',
    'src/modules/interview/questionPool.js',
  ],

  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'text-summary', 'lcov'],

  // Conservative floors so `npm test -- --coverage` stays green while still
  // guarding against regressions. Bump these up as the suite grows.
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 70,
      functions: 80,
      lines: 80,
    },
  },
};
