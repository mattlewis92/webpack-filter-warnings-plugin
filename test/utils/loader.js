module.exports = function dummyloader(source, sourceMap) {
  this.emitWarning(new Error('show me'));
  this.emitWarning(new Error('hide me'));
  this.callback(null, source, sourceMap);
};
