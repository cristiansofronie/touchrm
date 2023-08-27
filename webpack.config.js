const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const webpack = require("webpack");

const isProduction = process.env.NODE_ENV == 'production';

const config = {
  entry: './src/index.ts',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    port: 8000,
    open: false,
    host: 'localhost',
    // hot: true,
    client: {
      overlay: false,
    },
    static: './dist',
    allowedHosts: ['all'],
  },
  plugins: [
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: 'ts-loader',
        exclude: ['/node_modules/'],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '...'],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = 'production';
  } else {
    config.mode = 'development';
  }
  return config;
};
