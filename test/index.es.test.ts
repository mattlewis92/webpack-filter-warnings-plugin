import { FilterWarningsPlugin } from '../src/index.es';

jest.mock('../src/filterWarningsPlugin', () => ({
  FilterWarningsPlugin: {},
}));

describe('CJS export', () => {
  it('should be a defined CommonJS export', () => {
    expect(FilterWarningsPlugin).toBeDefined();
  });
});
