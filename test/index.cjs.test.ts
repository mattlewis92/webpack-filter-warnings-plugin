const CJS = require('../src/index.cjs'); // tslint:disable-line

jest.mock('../src/filterWarningsPlugin', () => ({
  FilterWarningsPlugin: {},
}));

describe('CJS export', () => {
  it('should be a defined CommonJS export', () => {
    expect(CJS).toBeDefined();
  });
});
