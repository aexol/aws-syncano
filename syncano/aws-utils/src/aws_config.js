'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.awsConfig = undefined;

let awsConfig = (() => {
  var _ref = _asyncToGenerator(function* ({ ctx, region }) {
    const { data, logger } = (0, _syncanoServer2.default)(ctx);
    const { error } = logger('aws-utils@aws-config:');
    var awsId;
    try {
      awsId = yield data.aws_id.firstOrFail();
    } catch (e) {
      throw new _error.AWSUtilsError('Please install and configure aws-config socket.');
    }
    const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = awsId;
    const creds = new _awsSdk2.default.Credentials({
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY
    });
    const config = new _awsSdk2.default.Config({
      region,
      credentials: creds
    });
    error(config);
    return config;
  });

  return function awsConfig(_x) {
    return _ref.apply(this, arguments);
  };
})();

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _syncanoServer = require('syncano-server');

var _syncanoServer2 = _interopRequireDefault(_syncanoServer);

var _error = require('./error');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.awsConfig = awsConfig;