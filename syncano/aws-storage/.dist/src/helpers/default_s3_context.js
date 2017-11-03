'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _default_bucket = require('./default_bucket');

var _default_bucket2 = _interopRequireDefault(_default_bucket);

var _default_region = require('./default_region');

var _default_region2 = _interopRequireDefault(_default_region);

var _syncanoServer = require('syncano-server');

var _syncanoServer2 = _interopRequireDefault(_syncanoServer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = (() => {
  var _ref = _asyncToGenerator(function* (ctx) {
    const db = (0, _default_bucket2.default)(ctx);
    const dr = (0, _default_region2.default)(ctx);
    const { data, socket } = (0, _syncanoServer2.default)(ctx);
    // Check if default bucket exists if not create one
    try {
      const bucket = yield data.bucket.where('name', db).firstOrFail();
    } catch (error) {
      const newBucket = yield socket.get('aws-storage/create_bucket', {
        name: db,
        region: dr,
        AMAZON_KEY: ctx.config.AMAZON_KEY
      });
    }
    const { AMAZON_KEY, bucketName = db, region = dr } = ctx.args;
    // If somebody wants to enter another socket or bucket AMAZON_KEY is needed as argument
    if (bucketName !== db || region !== dr) {
      if (AMAZON_KEY !== ctx.config.AMAZON_KEY) {
        throw new Error('You are not allowed to perform operations on this region or bucket. Pass AMAZON_KEY to do that');
      }
    }
    return {
      bucketName,
      region
    };
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})();