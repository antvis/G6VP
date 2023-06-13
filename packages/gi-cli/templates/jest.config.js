const esm = ['internmap', 'd3-*', 'lodash-es'].map(d => `_${d}|${d}`).join('|');

module.exports = {
  preset: 'ts-jest',
  silent: true,
  verbose: false,
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.(js,jsx,ts,tsx)?$': 'babel-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  moduleNameMapper: {
    '^lodash-es$': 'lodash',
    '^d3-(.*)$': `<rootDir>/node_modules/d3-$1/dist/d3-$1`,
    '\\.(css|less)$': 'identity-obj-proxy',
  },
  transformIgnorePatterns: [`<rootDir>/node_modules/(?!(${esm}))`],
};
