'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EC2 = undefined;

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _aws_config = require('./aws_config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let EC2 = class EC2 {
  constructor(ctx, region) {
    this.ctx = ctx;
    this.region = region;
    this.awsConfig = (0, _aws_config.awsConfig)({ ctx, region });
    this.ls = new _awsSdk2.default.EC2(this.awsConfig);
  }
};
exports.EC2 = EC2;