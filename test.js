const test2 = require('./es');
const test4 = require('./cjs');

console.log(test2);
console.log(test4);

module.exports = {
  context: __dirname + "/src",
  entry: "./index.test.ts",
  output: {
    path: __dirname + "/dist",
    filename: "bundle.js"
  },
};
