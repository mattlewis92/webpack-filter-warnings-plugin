import { Compiler } from 'webpack';
import FilterWarningsPlugin from '../src/index';
import webpack from './utils/webpack';

describe('Main library file', () => {
  it('should be a defined export', () => {
    expect(FilterWarningsPlugin).toBeDefined();
  });

  describe('Type guards', () => {
    it('should throw when invalid arguments are passed', async () => {
      try {
        await webpack({
          extend: {
            plugins: [
              new (FilterWarningsPlugin as any)({ exclude: 123 }), // We have to cast to break the type guard :)
            ],
          },
        });

        throw new Error('Should not be thrown');
      } catch (e) {
        expect(e).toMatchSnapshot();
      }
    });
  });

  describe('RegExp exclude', () => {
    it('should filter warnings by regexp', async () => {
      const stats = await webpack({
        extend: {
          plugins: [
            new FilterWarningsPlugin({ exclude: /hide/ }),
          ],
        },
      });

      expect(stats.compilation.warnings).toHaveLength(1);
      expect(stats.compilation.warnings).toMatchSnapshot();
    });

    it('should filter warnings by array of RegExps', async () => {
      const stats = await webpack({
        extend: {
          plugins: [
            new FilterWarningsPlugin({ exclude: [/hide/] }),
          ],
        },
      });

      expect(stats.compilation.warnings).toHaveLength(1);
      expect(stats.compilation.warnings).toMatchSnapshot();
    });
  });

  describe('String exclude', () => {
    it('should filter warnings based on string option', async () => {
      const stats = await webpack({
        extend: {
          plugins: [
            new FilterWarningsPlugin({ exclude: 'hide' }),
          ],
        },
      });

      expect(stats.compilation.warnings).toHaveLength(1);
      expect(stats.compilation.warnings).toMatchSnapshot();
    });
  });

  it('should support older Webpack (via "plugin" interface', () => {
    const pluginInstance = new FilterWarningsPlugin({ exclude: 'hide' });

    const oldCompilerMock = {
      plugin: jest.fn(() => ({})),
    } as any as Compiler;

    pluginInstance.apply(oldCompilerMock);

    expect(oldCompilerMock.plugin).toHaveBeenCalledWith('done', expect.any(Function));

    const callback = (oldCompilerMock.plugin as jest.Mock).mock.calls[0][1];
    const result = callback({
      compilation: {
        warnings: [{
          message: 'Test',
        }, { // Second message should be filtered!
          message: 'Hide me',
        }]
      }
    });

    expect(result.length).toEqual(1);
    expect(result[0]).toEqual({
      message: 'Test',
    });
  });
});

