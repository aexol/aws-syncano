'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _syncanoServer = require('syncano-server');

var _syncanoServer2 = _interopRequireDefault(_syncanoServer);

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _s = require('./helpers/s3');

var _s2 = _interopRequireDefault(_s);

var _default_s3_context = require('./helpers/default_s3_context');

var _default_s3_context2 = _interopRequireDefault(_default_s3_context);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = (() => {
  var _ref = _asyncToGenerator(function* (ctx) {
    const { data, response } = (0, _syncanoServer2.default)(ctx);
    try {
      const { bucketName, region } = yield (0, _default_s3_context2.default)(ctx);
      const { name, file } = ctx.args;
      const fileValue = Buffer.from(file.split(',')[1], 'base64');
      if (name.indexOf('/') !== -1) {
        throw new Error('You are not allowed to do that');
      }
      const s3instance = (0, _s2.default)({ ctx, region });
      s3instance.putObject({
        Body: fileValue,
        Bucket: bucketName,
        Key: name,
        ACL: 'public-read'
      }, function (err, data) {
        if (err) {
          return response.json({ err }, 400);
        } else {
          return response.json({
            data,
            link: `https://s3.${region}.amazonaws.com/${bucketName}/${name}`
          });
        }
      });
    } catch (error) {
      return response.json(error.message, 400);
    }
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})();