'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compareHash = exports.defaultHash = undefined;

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function defaultHash(raw) {
  return _crypto2.default.createHash('sha256').update(raw).digest('hex');
}

function compareHash(raw, hash) {
  if (raw === 'undefined') {
    return false;
  }
  if (raw.length === 0) {
    return false;
  }
  return defaultHash(raw) === hash;
}

exports.defaultHash = defaultHash;
exports.compareHash = compareHash;