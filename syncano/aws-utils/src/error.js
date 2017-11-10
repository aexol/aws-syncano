"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
let ErrorWithCode = class ErrorWithCode extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
};
let AWSUtilsError = class AWSUtilsError extends ErrorWithCode {
  constructor(message, code) {
    super(message, 400);
  }
};
let AWSForbidden = class AWSForbidden extends ErrorWithCode {
  constructor(message, code) {
    super(message, 403);
  }
};
exports.AWSUtilsError = AWSUtilsError;
exports.AWSForbidden = AWSForbidden;
exports.ErrorWithCode = ErrorWithCode;