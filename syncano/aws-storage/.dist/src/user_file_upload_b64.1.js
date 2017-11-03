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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = (() => {
  var _ref = _asyncToGenerator(function* (ctx) {
    const { data, response } = (0, _syncanoServer2.default)(ctx);
    try {
      const { name, file, bucket_name, region } = ctx.args;
      const { user } = ctx.meta;
      if (typeof user === 'undefined') {
        throw new Error('You must be logged in to read or upload files to this endpoint');
      }

      if (name.indexOf("/") !== -1) {
        throw new Error("You are not allowed to do that");
      }
      const fileValue = Buffer.from(file.split(',')[1], 'base64');
      const s3instance = (0, _s2.default)({ ctx, region });
      const fullName = `${user.id}/${name}`;
      s3instance.putObject({
        Body: fileValue,
        Bucket: bucket_name,
        Key: fullName,
        ACL: 'private'
      }, function (err, data) {
        if (err) {
          return response.json({ err }, 400);
        } else {
          return response.json({
            data,
            link: `https://s3.${region}.amazonaws.com/${bucket_name}/${fullName}`
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