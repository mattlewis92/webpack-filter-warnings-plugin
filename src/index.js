function filterWarnings(exclude, result) {
  result.compilation.warnings = result.compilation.warnings.filter( // eslint-disable-line no-param-reassign
    warning => !exclude.some(regexp => regexp.test(warning.message)),
  );
}

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
    if (typeof compiler.hooks !== 'undefined') {
      compiler.hooks.done.tap('filter-warnings-plugin', (result) => {
        filterWarnings(this.exclude, result);
      });
    } else {
      compiler.plugin('done', (result) => {
        filterWarnings(this.exclude, result);
      });
    }
  }
}
