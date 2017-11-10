import {compareHash} from './utils.js'
import {AWSUtilsError} from './error'
import Server from 'syncano-server'

async function isAdmin(ctx) {
  const {data} = Server(ctx)
  var security
  try {
    security = await data.security.firstOrFail()
  } catch (e) {
    throw new AWSUtilsError('Please install and configure aws-config socket.')
  }
  return compareHash(ctx.args.AMAZON_KEY, security.AMAZON_KEY)
}

export {isAdmin}
