const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const {
  NODE_ENV = 'production',
} = process.env;

module.exports = {
  target: 'node',
  mode: NODE_ENV,
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@joint-editing/diff-library': path.resolve(__dirname, '../diff-library/src'),
    },
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  },
  externals: [ nodeExternals() ],
  plugins: [
    new CleanWebpackPlugin(),
  ],
};
