import {compareHash} from './utils.js'
import {AWSUtilsError} from './error'

async function isAdmin(ctx, server) {
  const {data, logger} = server
  const {error} = logger('aws-util@aws-security')
  var security
  try {
    security = await data.security.firstOrFail()
  } catch (e) {
    throw new AWSUtilsError('Please install and configure aws-config socket.')
  }
  return compareHash(ctx.args.AMAZON_KEY, security.AMAZON_KEY)
}

export {isAdmin}
