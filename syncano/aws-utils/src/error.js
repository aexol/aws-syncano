class ErrorWithCode extends Error {
  constructor(message, code) {
    super(message)
    this.code = code
  }
}
class AWSUtilsError extends ErrorWithCode {
  constructor(message, code) {
    super(message, 400)
  }
}
class AWSForbidden extends ErrorWithCode {
  constructor(message, code) {
    super(message, 403)
  }
}
export {AWSUtilsError, AWSForbidden, ErrorWithCode}
