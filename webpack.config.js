const webpack = require("webpack");
const path = require("path");
const Dotenv = require("dotenv-webpack");

const config = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "public"),
    publicPath: "/",
    filename: "bundle.js",
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
      watch: true,
    },
    compress: true,
    port: 3000,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
            },
          },
        ],
      },
      {
        test: /\.js$/,
        enforce: "pre",
        use: ["source-map-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".jsx", ".js"],
  },
  plugins: [new Dotenv()],
};

module.exports = config;
