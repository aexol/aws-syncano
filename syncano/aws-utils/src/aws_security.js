'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAdmin = undefined;

let isAdmin = (() => {
  var _ref = _asyncToGenerator(function* (ctx) {
    const { data } = (0, _syncanoServer2.default)(ctx);
    var security;
    try {
      security = yield data.security.firstOrFail();
    } catch (e) {
      throw new _error.AWSUtilsError('Please install and configure aws-config socket.');
    }
    return (0, _utils.compareHash)(ctx.args.AMAZON_KEY, security.AMAZON_KEY);
  });

  return function isAdmin(_x) {
    return _ref.apply(this, arguments);
  };
})();

var _utils = require('./utils.js');

var _error = require('./error');

var _syncanoServer = require('syncano-server');

var _syncanoServer2 = _interopRequireDefault(_syncanoServer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.isAdmin = isAdmin;