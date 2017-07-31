export default class FilterWarningsPlugin {
  constructor({ exclude }) {
    if (exclude instanceof RegExp) {
      exclude = [exclude]; // eslint-disable-line no-param-reassign
    }
    if (!Array.isArray(exclude)) {
      throw new Error('Exclude an only be a regexp or an array of regexp');
    }
    this.exclude = exclude;
  }

  apply(compiler) {
    compiler.plugin('done', (result) => {
      result.compilation.warnings = result.compilation.warnings.filter( // eslint-disable-line no-param-reassign
        warning => !this.exclude.some(regexp => regexp.test(warning.message)),
      );
    });
  }
}
