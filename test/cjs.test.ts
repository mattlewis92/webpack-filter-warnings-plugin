const CJS = require('cjs'); // tslint:disable-line

jest.mock('../src/index', () => ({}));

describe('CJS export', () => {
  it('should be a defined CommonJS export', () => {
    expect(CJS).toBeDefined();
  });
});
