const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  target: "node",
  externals: [nodeExternals({whitelist: "aws-utils"})],
  entry: {
    create_instance: './src/create_instance.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './scripts')
  }
};

