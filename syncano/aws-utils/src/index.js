'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AWSForbidden = exports.AWSUtilsError = exports.ErrorWithCode = exports.Lightsail = exports.S3 = exports.compareHash = exports.defaultHash = exports.isAdmin = exports.awsDefaultS3Context = exports.awsDefaultBucket = exports.awsDefaultRegion = exports.awsConfig = exports.makeid = undefined;

var _aws_config = require('./aws_config');

var _default_region = require('./default_region');

var _default_bucket = require('./default_bucket');

var _default_s3_context = require('./default_s3_context');

var _default_s3_context2 = _interopRequireDefault(_default_s3_context);

var _aws_security = require('./aws_security');

var _s = require('./s3');

var _lightsail = require('./lightsail');

var _utils = require('./utils');

var _error = require('./error');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function makeid(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

exports.makeid = makeid;
exports.awsConfig = _aws_config.awsConfig;
exports.awsDefaultRegion = _default_region.awsDefaultRegion;
exports.awsDefaultBucket = _default_bucket.awsDefaultBucket;
exports.awsDefaultS3Context = _default_s3_context2.default;
exports.isAdmin = _aws_security.isAdmin;
exports.defaultHash = _utils.defaultHash;
exports.compareHash = _utils.compareHash;
exports.S3 = _s.S3;
exports.Lightsail = _lightsail.Lightsail;
exports.ErrorWithCode = _error.ErrorWithCode;
exports.AWSUtilsError = _error.AWSUtilsError;
exports.AWSForbidden = _error.AWSForbidden;