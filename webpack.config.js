const path = require("path");
const libName = "vue2-waterfall";
const { VueLoaderPlugin } = require("vue-loader");

module.exports = {
  entry: "./index.js",
  output: {
    filename: libName + ".js",
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "umd",
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
    ],
  },
  plugins: [new VueLoaderPlugin()],
};
