export type AllowedFilter = ((filterPhrase: string) => boolean) | RegExp;

export type ExcludeOption = string | AllowedFilter ;

export interface WebpackFilterWarningsPluginOptions {
  exclude: ExcludeOption | ExcludeOption[];
}

export type WebpackLogWarning = string | ({ message: string });
