export type ExcludeOption = string | RegExp;

export interface WebpackFilterWarningsPluginOptions {
  exclude: ExcludeOption | ExcludeOption[];
}
