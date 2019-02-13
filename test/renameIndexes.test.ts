import fs from 'fs';
import glob from 'glob';

import '../build-tools/renameIndexes';

jest.mock('fs');
jest.mock('glob', () => jest.fn());

describe('Rename indexes build tool', () => {
  it('should prepare renamed files list and call rename', () => {
    const globCalls = (glob as any as jest.Mock).mock.calls[0];
    expect(glob as any as jest.Mock).toHaveBeenCalled();

    const globCallback = globCalls[1];
    const paths = [
      '/test/path/cjs/index.cjs.ts',
      '/test/path/cjs/index.cjs.d.ts',
      '/test/path/es/index.es.ts',
      '/test/path/es/index.es.d.ts',
    ];
    globCallback(null, paths);

    expect(fs.renameSync).toHaveBeenCalledTimes(4);
    expect(fs.renameSync).toHaveBeenCalledWith(paths[0], '/test/path/cjs/index.ts');
    expect(fs.renameSync).toHaveBeenCalledWith(paths[1], '/test/path/cjs/index.d.ts');
    expect(fs.renameSync).toHaveBeenCalledWith(paths[2], '/test/path/es/index.ts');
    expect(fs.renameSync).toHaveBeenCalledWith(paths[3], '/test/path/es/index.d.ts');
  });
});
