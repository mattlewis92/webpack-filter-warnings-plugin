import MemoryFileSystem from 'memory-fs';
import * as path from 'path';
import webpack, { Compiler, Configuration, Stats } from 'webpack';

const loader: string = require.resolve('./loader');

export const webpackRunner: any = ({ fixture = 'basic.js', extend = {} } = {}): Promise<Stats> => {
  const config: Configuration = {
    mode: 'development',
    entry: path.join(__dirname, '..', 'fixtures', fixture),
    output: {
      path: path.join(__dirname, '..', 'fixtures', 'dist'),
    },
    module: {
      rules: [{
        test: /\.js$/,
        loader,
      }],
    },
    ...extend,
  };

  return new Promise((resolve, reject) => {
    const compiler: Compiler = webpack(config);

    compiler.outputFileSystem = new MemoryFileSystem();
    compiler.run((err, stats) => {
      if (err) {
        return reject(err);
      }

      return resolve(stats);
    });
  });
};
