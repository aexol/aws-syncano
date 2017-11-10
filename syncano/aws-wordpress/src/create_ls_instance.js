import Server from 'syncano-server'
import {awsConfig, isAdmin, makeid, ErrorWithCode} from 'local-aws-utils'

export default async (ctx) => {
  const {data, response, logger} = Server(ctx)
  const {error} = logger('aws-wordpress@create_instance:')
  try {
    if (!(await isAdmin(ctx))) {
      return response.json({message: 'Forbidden'}, 403)
    }
    var newLightsailInstance = ctx.meta.instance + '-' + makeid(5)
    return response.json(awsConfig({ctx: ctx, region: 'eu-central-1'}), 200)
  } catch (e) {
    if (e instanceof ErrorWithCode) {
      return response.json({message: e.message}, e.code)
    }
    error(e)
    error(e.stack)
    return response.json({message: 'Internal Server Error'}, 501)
  }
}
