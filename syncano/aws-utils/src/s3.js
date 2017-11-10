'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.S3 = undefined;

let S3 = (() => {
  var _ref = _asyncToGenerator(function* (ctx, region) {
    const _awsConfig = yield (0, _aws_config.awsConfig)({ ctx, region });
    return new _awsBluebird2.default.S3(_awsConfig);
  });

  return function S3(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

var _awsBluebird = require('aws-bluebird');

var _awsBluebird2 = _interopRequireDefault(_awsBluebird);

var _aws_config = require('./aws_config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.S3 = S3;