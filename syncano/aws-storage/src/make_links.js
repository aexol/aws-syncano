import Server from 'syncano-server'
import {S3, awsDefaultS3Context, isAdmin, ErrorWithCode} from 'aws-utils'

export default async ctx => {
  const {response, logger} = Server(ctx)
  const {error} = logger('aws-storage/make-links')
  try {
    if (!await isAdmin(ctx)) {
      return response.json({message: 'Forbidden'}, 403)
    }
    const {bucketName, region} = await awsDefaultS3Context(ctx)
    const {names} = ctx.args
    const {EXPIRE = 3600} = ctx.config
    if (!Array.isArray(names)) {
      return response.json(
        {message: 'names are required and must be an array of strings'},
        400
      )
    }
    const s3instance = await S3(ctx, region)
    const links = {}
    names.forEach(async element => {
      if (typeof element !== 'string') {
        error(element + ' is not a string')
        return
      }
      try {
        const link = await s3instance.getSignedUrl('getObject', {
          Bucket: bucketName,
          Key: element,
          Expires: EXPIRE
        })
        links[element] = link
      } catch (e) {
        error('error creating signed url for ' + element)
      }
    })
    return response.json({files: links})
  } catch (e) {
    if (e instanceof ErrorWithCode) {
      return response.json({message: e.message}, e.code)
    }
    error(e.stack)
    return response.json({message: e.stack}, 501)
  }
}
