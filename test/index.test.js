import FilterWarningsPlugin from '../src/cjs';
import webpack from './utils/webpack';

test('filter warnings by regexp', async () => {
  const stats = await webpack({
    extend: {
      plugins: [
        new FilterWarningsPlugin({ exclude: /hide/ }),
      ],
    },
  });
  expect(stats.compilation.warnings).toMatchSnapshot();
});

test('allow array of regexp to filter by', async () => {
  const stats = await webpack({
    extend: {
      plugins: [
        new FilterWarningsPlugin({ exclude: [/hide/] }),
      ],
    },
  });
  expect(stats.compilation.warnings).toMatchSnapshot();
});

test('throw when invalid arguments', async () => {
  try {
    await webpack({
      extend: {
        plugins: [
          new FilterWarningsPlugin({}),
        ],
      },
    });
  } catch (e) {
    expect(e).toMatchSnapshot();
  }
});

test('allow filter warnings that are strings', async () => {
  const stats = await webpack({
    extend: {
      plugins: [
        {
          apply(compiler) {
            compiler.hooks.done.tap('filter-warnings-plugin', (result) => {
              result.compilation.warnings.push('hide this string');
            });
          },
        },
        new FilterWarningsPlugin({ exclude: /hide/ }),
      ],
    },
  });
  expect(stats.compilation.warnings).toMatchSnapshot();
});
