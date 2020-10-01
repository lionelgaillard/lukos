const { join } = require('path');
const { BannerPlugin } = require('webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'production',
  target: 'node',
  externals: [nodeExternals()],
  entry: './src/cli.ts',
  node: {
    __dirname: true,
  },
  output: {
    path: join(__dirname, 'bin'),
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
