'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _default_bucket = require('./default_bucket');

var _default_region = require('./default_region');

var _error = require('./error');

var _aws_security = require('./aws_security');

var _s = require('./s3');

var _syncanoServer = require('syncano-server');

var _syncanoServer2 = _interopRequireDefault(_syncanoServer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = (() => {
  var _ref = _asyncToGenerator(function* (ctx) {
    const db = (0, _default_bucket.awsDefaultBucket)(ctx);
    const dr = (0, _default_region.awsDefaultRegion)(ctx);
    const { data, socket } = (0, _syncanoServer2.default)(ctx);
    // Check if default bucket exists if not create one
    var bucket;
    try {
      bucket = yield data.bucket.where('name', db).firstOrFail();
    } catch (error) {
      const s3instance = yield (0, _s.S3)(ctx, dr);
      const res = yield s3instance.createBucket({
        Bucket: db
      });
      bucket = yield data.bucket.create({ name: db, region: dr });
    }
    const { AMAZON_KEY, bucketName = db, region = dr } = ctx.args;
    // If somebody wants to enter another socket or bucket AMAZON_KEY is needed as argument
    if (bucketName !== db || region !== dr) {
      if (!(yield (0, _aws_security.isAdmin)(ctx))) {
        throw new _error.AWSForbidden('You are not allowed to perform operations on this region or bucket. Pass AMAZON_KEY to do that');
      }
    }
    return {
      bucketName: bucket.name,
      region: bucket.region
    };
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})();