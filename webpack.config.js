const webpack = require("webpack")
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
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["modern-browsers"]
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin({
      // banner: `${pkg.name} v${pkg.version} | ${pkg.license} License | ${pkg.homepage}`
      banner: [
        `${pkg.name} v${pkg.version} - ${pkg.description}`,
        `On the web at ${pkg.homepage}`,
        `Written by ${pkg.author}`,
        `Licensed under ${pkg.license}`,
      ].join("\n")
    })
  ]
};
