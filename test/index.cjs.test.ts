const CJS = require('../src/index.cjs'); // tslint:disable-line

jest.mock('../src/index.es', () => ({
  FilterWarningsPlugin: {},
}));

describe('CJS export', () => {
  it('should be a defined CommonJS export', () => {
    expect(CJS).toBeDefined();
  });
});
