const { BannerPlugin } = require('webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'production',
  target: 'node',
  externals: [nodeExternals()],
  entry: './src/cli.ts',
  output: {
    path: __dirname,
    filename: 'lukos',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [{ test: /\.ts/, loader: 'ts-loader' }],
  },
  plugins: [new BannerPlugin({ banner: '#!/usr/bin/env node', raw: true })],
};
