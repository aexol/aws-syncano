'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = ({ ctx, region }) => {
  const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = ctx.config;
  const creds = new _awsSdk2.default.Credentials({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
  });
  const config = new _awsSdk2.default.Config({
    region,
    credentials: creds
  });
  return config;
};