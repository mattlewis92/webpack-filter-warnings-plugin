function getType(value) {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}

function filterWarnings(exclude, { compilation }) {
  compilation.warnings = compilation.warnings.filter(warning => !exclude.some((rule) => { // eslint-disable-line no-param-reassign
    switch (getType(rule)) {
      case 'regexp':
        return rule.test(warning.message || warning);
      case 'function':
        return rule.call(null, warning);
      default:
        return false;
    }
  }));
}

export default class FilterWarningsPlugin {
  constructor(options) {
    this.exclude = [].concat(options && options.exclude);
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
