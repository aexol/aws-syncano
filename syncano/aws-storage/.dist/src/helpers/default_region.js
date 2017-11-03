'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = ctx => {
  const { REGION = 'eu-central-1' } = ctx.config;
  return REGION;
};