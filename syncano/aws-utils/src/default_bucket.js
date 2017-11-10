"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const awsDefaultBucket = ctx => `${ctx.meta.instance}-bucket`;
exports.awsDefaultBucket = awsDefaultBucket;