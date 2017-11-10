'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Lightsail = undefined;

var _awsBluebird = require('aws-bluebird');

var _awsBluebird2 = _interopRequireDefault(_awsBluebird);

var _aws_config = require('./aws_config');

var _error = require('./error');

var _semver = require('semver');

var semver = _interopRequireWildcard(_semver);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function Lightsail(ctx, region) {
  var _this = this;

  const _awsConfig = (0, _aws_config.awsConfig)({ ctx, region });
  const ls = new _awsBluebird2.default.Lightsail(_awsConfig);

  ls.getGroupBlueprints = (() => {
    var _ref = _asyncToGenerator(function* (group) {
      const data = yield _this.getBlueprints();
      var blueprints = {};
      for (var i = 0; i < data.blueprints.length; i++) {
        if (data.blueprints[i].group === group) {
          blueprints[data.blueprints[i].version] = data.blueprints[i].blueprintId;
        }
      }
      return blueprints;
    });

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  })();

  ls.getWordpressBlueprints = _asyncToGenerator(function* () {
    return _this.getGroupBlueprints('wordpress');
  });

  ls.getWordpressBlueprintId = (() => {
    var _ref3 = _asyncToGenerator(function* (version) {
      const wordpressBlueprints = yield _this.getWordpressBlueprints();
      const versions = Object.keys(wordpressBlueprints).sort(semver.rcompare);
      if (typeof version === 'undefined') {
        version = '*';
      }
      version = semver.validRange(version);
      if (version == null) {
        throw new _error.AWSUtilsError('Invalid version range.');
      }
      return wordpressBlueprints[semver.maxSatisfying(versions, version)];
    });

    return function (_x2) {
      return _ref3.apply(this, arguments);
    };
  })();

  ls.getRegion = _asyncToGenerator(function* () {
    const data = yield _this.getRegions({
      includeAvailabilityZones: true
    });
    for (var i = 0; i < data.regions.length; i++) {
      if (data.regions[i].name === _this.region) {
        return data.regions[i];
      }
    }
    throw new _error.AWSUtilsError('Invalid region.');
  });

  ls.getAvailabilityZones = _asyncToGenerator(function* () {
    const region = yield _this.getRegion();
    return region.availabilityZones;
  });
  return ls;
}

exports.Lightsail = Lightsail;