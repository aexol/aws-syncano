import Server from 'syncano-server'
import {S3, isAdmin, ErrorWithCode, AWSForbidden} from 'aws-utils'

export default async ctx => {
  const {response, logger} = Server(ctx)
  const {error} = logger('aws-storage/create-bucket')
  const {name, region} = ctx.args
  try {
    if (!await isAdmin(ctx)) {
      throw new AWSForbidden('Bad amazon key')
    }
    const s3instance = await S3(ctx, region)
    const res = await s3instance.createBucket({
      Bucket: name
    })
    return response.json(res)
  } catch (e) {
    if (e instanceof ErrorWithCode) {
      return response.json({message: e.message}, e.code)
    }
    error(e.stack)
    return response.json(e, 400)
  }
}
