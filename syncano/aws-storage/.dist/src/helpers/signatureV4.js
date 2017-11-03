'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _syncanoServer = require('syncano-server');

var _syncanoServer2 = _interopRequireDefault(_syncanoServer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = (() => {
  var _ref = _asyncToGenerator(function* (ctx) {
    const { logger } = (0, _syncanoServer2.default)(ctx);
    const {
      config: {
        AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY: key,
        MAX_SIZE = 104857600
      },
      args: { bucket, region, prefix = 'files/' }
    } = ctx;

    const policyDate = '20170725';
    const serviceName = 's3';

    function sign(key, message) {
      return _crypto2.default.createHmac('sha256', key).update(message).digest();
    }

    function getSignatureKey({ key, region, service, dateStamp }) {
      return sign(sign(sign(sign('AWS4' + key, dateStamp), region), service), 'aws4_request');
    }

    let expirationDate = new Date(new Date().getTime() + 1 * 60 * 60 * 1000).toISOString();
    let fileKey = prefix + _crypto2.default.randomBytes(20).toString('hex');

    let policy = {
      expiration: expirationDate,
      conditions: [{
        bucket: bucket
      }, {
        acl: 'public-read'
      }, ['starts-with', '$key', fileKey], ['content-length-range', 0, maxSize]]
    };

    let policyB64 = Buffer.from(JSON.stringify(policy)).toString('base64');
    let sigKey = getSignatureKey({
      AWS_SECRET_ACCESS_KEY,
      policyDate,
      region,
      serviceName
    });
    let signature = sign(sigKey, policyB64).toString('hex');
    return {
      url: `https://${bucket}.s3.amazonaws.com`,
      method: 'POST',
      params: {
        AWSAccessKeyId: AWS_ACCESS_KEY_ID,
        Policy: policyB64,
        Signature: signature,
        acl: 'public-read',
        key: fileKey
      }
    };
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})();