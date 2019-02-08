import * as webpack from 'webpack';

import Loader = webpack.loader.Loader;

// In order to properly cast types, we have to create "builder"
type LoaderBuilder = () => Loader;

const loaderBuilder: LoaderBuilder = () => function (source: any, sourceMap: any) {
  this.emitWarning(new Error('show me'));
  this.emitWarning(new Error('hide me'));
  this.callback(null, source, sourceMap);

  return;
};

export default loaderBuilder();
