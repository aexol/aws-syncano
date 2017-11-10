'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const awsDefaultRegion = ctx => {
  const { REGION = 'eu-central-1' } = ctx.config;
  return REGION;
};

exports.awsDefaultRegion = awsDefaultRegion;