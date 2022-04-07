/* eslint-disable no-undef */
// Generated using webpack-cli https://github.com/webpack/webpack-cli
const path = require('path');
const isProduction = process.env.NODE_ENV == 'production';

const config = {
  target: 'node',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '.src/index.js',
    library: 'joi-schema-lib',
    libraryTarget: 'umd',
    clean: true
  },
  plugins: [
  ],
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/i,
        exclude: ['/node_modules/'],
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 20000,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000
    }
  },
  devtool: 'source-map'
};

module.exports = () => {
  if (isProduction) {
    config.mode = 'production';
  } else {
    config.mode = 'development';
  }
  return config;
};
