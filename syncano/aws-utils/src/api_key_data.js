'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _Data2 = require('syncano-server/Data');

var _Data3 = _interopRequireDefault(_Data2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Monkey patch request to include admin-token with internal aws admin user.
// Only for use inside library
let Data = class Data extends _Data3.default {
  //constructor(users, ctx) {
  //  super(ctx)
  //  this.admin = users.where('username', '_internal_aws_admin').firstOrFail()
  //}

  //async fetch(url, options, headers = {}) {
  //  const headersToSend = Object.assign(
  //    {
  //      _user_key: (await this.admin).user_key
  //    },
  //    headers
  //  )
  //  return super.fetch(url, options, headersToSend)
  //}
};
exports.default = Data;