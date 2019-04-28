const path = require("path");
const pkg  = require("./package.json");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: `${pkg.name}.js`,
    library: "Meed",
    // CommonJS, AMD and as a global variable
    libraryTarget: "umd",
    // make UMD build available in Node.js & browsers
    globalObject: "this",
    // name the AMD module of the UMD build (anon is default)
    umdNamedDefine: true
  }
};
