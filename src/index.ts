import { Compiler, Plugin, Stats } from 'webpack';

import { ExcludeOption, WebpackFilterWarningsPluginOptions } from './interfaces';

export default class FilterWarningsPlugin extends Plugin {
  private static convertToRegExp(exclude: ExcludeOption[]): RegExp[] {
    return exclude.map((excludeEntry: ExcludeOption) => {
      if (!(excludeEntry instanceof RegExp)) {
        // Fallback - we allow to pass strings as input and convert them to wildcard RegExps
        excludeEntry = new RegExp(`.*${excludeEntry}.*`, 'i');
      }

      return excludeEntry as RegExp;
    });
  }

  private static filterWarnings(exclude: RegExp[], result: Stats) {
    result.compilation.warnings = result.compilation.warnings.filter(
      warning => !exclude.some((regexp: RegExp) => regexp.test(warning.message || warning)),
    );
  }

  /**
   * Checks if user-provided exclude is compatible with plugin
   */
  private static isSupportedOption(exclude: ExcludeOption | ExcludeOption[]): boolean {
    if (Array.isArray(exclude)) {
      return exclude.reduce((memo, excludeEntry) =>
        memo && FilterWarningsPlugin.isSupportedSimpleType(excludeEntry), true);
    } else {
      return FilterWarningsPlugin.isSupportedSimpleType(exclude);
    }
  }

  /**
   * Detects whether single exclude option is of supported type
   */
  private static isSupportedSimpleType(exclude: ExcludeOption): boolean {
    return exclude instanceof RegExp ||
      typeof exclude === 'string';
  }

  private exclude: RegExp[];

  constructor({ exclude }: WebpackFilterWarningsPluginOptions) {
    super();

    if (!FilterWarningsPlugin.isSupportedOption(exclude)) {
      throw new Error('Exclude can only be string, RegExp or Array of these');
    }

    if (!Array.isArray(exclude)) {
      exclude = [exclude];
    }

    this.exclude = FilterWarningsPlugin.convertToRegExp(exclude);
  }

  public apply(compiler: Compiler) {
    if (typeof compiler.hooks !== 'undefined') {
      compiler.hooks.done.tap('filter-warnings-plugin', (result: Stats) => {
        FilterWarningsPlugin.filterWarnings(this.exclude, result);
      });
    } else {
      compiler.plugin('done', (result) => {
        FilterWarningsPlugin.filterWarnings(this.exclude, result);
      });
    }
  }
}
