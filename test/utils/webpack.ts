import MemoryFileSystem from 'memory-fs';
import path from 'path';
import webpack, { Configuration, Stats } from 'webpack';

const loader = require.resolve('./loader');

export default function ({ fixture = 'basic.js', extend = {} } = {}): Promise<Stats> {
  const config = {
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
  } as Configuration;

  return new Promise((resolve, reject) => {
    const compiler = webpack(config);

    compiler.outputFileSystem = new MemoryFileSystem();
    compiler.run((err, stats) => {
      if (err) {
        return reject(err);
      }

      return resolve(stats);
    });
  });
}
