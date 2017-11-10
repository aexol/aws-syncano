'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _syncanoServer = require('syncano-server');

var _syncanoServer2 = _interopRequireDefault(_syncanoServer);

var _api_key_data = require('./api_key_data');

var _api_key_data2 = _interopRequireDefault(_api_key_data);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Monkey patch syncano functions.

exports.default = (ctx = {}) => {
  const Server = (0, _syncanoServer2.default)(ctx);
  _syncanoServer2.default.data = (0, _api_key_data2.default)(_syncanoServer2.default.config);
  return Server;
};