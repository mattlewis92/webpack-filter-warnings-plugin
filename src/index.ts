import { compilation as webpackCompilation, Compiler, Plugin, Stats } from 'webpack';

import { AllowedFilter, ExcludeOption, WebpackFilterWarningsPluginOptions, WebpackLogWarning } from './interfaces';

export class FilterWarningsPlugin implements Plugin {
  private static convertToAllowedValues(exclude: ExcludeOption[]): AllowedFilter[] {
    return exclude.map((excludeEntry: ExcludeOption) => {
      if (typeof excludeEntry === 'string') {
        // Fallback - we allow to pass strings as input and convert them to wildcard RegExps
        excludeEntry = new RegExp(excludeEntry, 'i');
      }

      return excludeEntry;
    });
  }

  private static filterWarning(exclude: AllowedFilter[], warning: WebpackLogWarning): boolean {
    return !exclude.some((filter: AllowedFilter) => {
      const message: string = (warning as { message: string }).message ?
        (warning as { message: string }).message : (warning as string || '');

      if (filter instanceof RegExp) {
        return filter.test(message);
      } else if (typeof filter === 'function') {
        return filter.call(undefined, message);
      }

      return false;

    });
  }

  /**
   * Filters warnings array.
   * Mutates the data!
   */
  private static filterWarnings(
    exclude: AllowedFilter[],
    compilation: webpackCompilation.Compilation,
  ): WebpackLogWarning[] {
    compilation.warnings = compilation.warnings.filter((warning: WebpackLogWarning) =>
      FilterWarningsPlugin.filterWarning(exclude, warning),
    );

    if (compilation.children) {
      compilation.children.forEach((c: webpackCompilation.Compilation) =>
        FilterWarningsPlugin.filterWarnings(exclude, c),
      );
    }
    return compilation.warnings;
  }

  /**
   * Checks if user-provided exclude is compatible with plugin
   */
  private static isSupportedOption(exclude: ExcludeOption | ExcludeOption[]): boolean {
    if (Array.isArray(exclude)) {
      return exclude.reduce((memo: boolean, excludeEntry: ExcludeOption) =>
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

  private readonly exclude: AllowedFilter[];

  public constructor({ exclude }: WebpackFilterWarningsPluginOptions) {
    if (!FilterWarningsPlugin.isSupportedOption(exclude)) {
      throw new Error('Exclude can only be string, RegExp or Array of these');
    }

    if (!Array.isArray(exclude)) {
      exclude = [exclude];
    }

    this.exclude = FilterWarningsPlugin.convertToAllowedValues(exclude);
  }

  public apply(compiler: Compiler): void {
    compiler.hooks.done.tap('filter-warnings-plugin', (result: Stats) =>
      FilterWarningsPlugin.filterWarnings(this.exclude, result.compilation));
  }
}
