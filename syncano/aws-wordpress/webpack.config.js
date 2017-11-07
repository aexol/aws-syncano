const path = require('path');
const nodeExternals = require('webpack-node-externals');
const WrapperPlugin = require('wrapper-webpack-plugin');

module.exports = {
  target: "node",
  externals: [nodeExternals({whitelist: "aws-utils"})],
  entry: {
    create_ls_instance: './lib/create_ls_instance.js'
  },
  output: {
    library: '[name]',
    libraryTarget: 'commonjs2',
    filename: '[name].js',
    path: path.resolve(__dirname, './src')
  },
  plugins: [
    // strict mode for the whole bundle
    new WrapperPlugin({
      test: /\.js$/, // only wrap output of bundle files with '.js' extension 
      header: '',
      footer: '\n"use strict";\nObject.defineProperty(exports, "__esModule", { value: true });\nexports.default = module.exports["default"]\nmodule.exports = exports["default"];\n'
    })
  ]
};

