import { Plugin } from 'webpack';

export = WebpackFilterWarningsPlugin;

declare class WebpackFilterWarningsPlugin extends Plugin {
  constructor(options: WebpackFilterWarningsPlugin.Options);
}

declare namespace WebpackFilterWarningsPlugin {
  interface Options {
    exclude: string | RegExp;
  }
}
