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
    const { name, region, AMAZON_KEY } = ctx.args;
    try {
      if (AMAZON_KEY !== ctx.config.AMAZON_KEY) {
        throw new Error('Bad amazon key');
      }
      const s3instance = (0, _s2.default)({ ctx, region });
      s3instance.createBucket({
        Bucket: name
      }, (() => {
        var _ref2 = _asyncToGenerator(function* (err, res) {
          if (err) {
            return response.json({ err }, 400);
          } else {
            const newBucketClass = yield data.bucket.create({ name });
            return response.json(res);
          }
        });

        return function (_x2, _x3) {
          return _ref2.apply(this, arguments);
        };
      })());
    } catch (error) {
      return response.json(error.message, 400);
    }
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})();