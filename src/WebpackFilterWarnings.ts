import { Compiler, Plugin, Stats } from 'webpack';

import { AllowedFilter, ExcludeOption, WebpackFilterWarningsPluginOptions, WebpackLogWarning } from './interfaces';

export default class FilterWarningsPlugin implements Plugin {
  private static convertToAllowedValues(exclude: ExcludeOption[]): AllowedFilter[] {
    return exclude.map((excludeEntry: ExcludeOption) => {
      if (typeof excludeEntry === 'string') {
        // Fallback - we allow to pass strings as input and convert them to wildcard RegExps
        excludeEntry = new RegExp(`.*${excludeEntry}.*`, 'i');
      }

      return excludeEntry as AllowedFilter;
    });
  }

  private static filterWarning(exclude: AllowedFilter[], warning: WebpackLogWarning) {
    return !exclude.some((filter: AllowedFilter) => {
      let message: string;

      if ((warning as { message: string }).message) {
        message = (warning as { message: string }).message;
      } else {
        message = warning as string || '';
      }

      if (filter instanceof RegExp) {
        return filter.test(message)
      } else if (typeof filter === 'function') {
        return filter.call(null, message);
      }

      return false;

    });
  }

  /**
   * Filters warnings array.
   * Mutates the data!
   */
  private static filterWarnings(exclude: AllowedFilter[], result: Stats) {
    result.compilation.warnings = result.compilation.warnings.filter(
      (warning: WebpackLogWarning) => FilterWarningsPlugin.filterWarning(exclude, warning));

    return result.compilation.warnings;
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
      typeof exclude === 'string' ||
      typeof exclude === 'function';
  }

  private exclude: AllowedFilter[];

  constructor({ exclude }: WebpackFilterWarningsPluginOptions) {
    if (!FilterWarningsPlugin.isSupportedOption(exclude)) {
      throw new Error('Exclude can only be string, RegExp or Array of these');
    }

    if (!Array.isArray(exclude)) {
      exclude = [exclude];
    }

    this.exclude = FilterWarningsPlugin.convertToAllowedValues(exclude);
  }

  public apply(compiler: Compiler) {
    if (typeof compiler.hooks !== 'undefined') {
      compiler.hooks.done.tap('filter-warnings-plugin', (result: Stats) => {
        return FilterWarningsPlugin.filterWarnings(this.exclude, result);
      });
    } else {
      compiler.plugin('done', (result) => {
        return FilterWarningsPlugin.filterWarnings(this.exclude, result);
      });
    }
  }
}
