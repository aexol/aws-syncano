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
    let {fileNames} = ctx.args
    const {EXPIRE = 3600} = ctx.config
    if (typeof fileNames === 'string') {
      fileNames = [fileNames]
    }
    if (!Array.isArray(fileNames)) {
      return response.json(
        {
          message: 'invalid usage',
          expected:
            'fileNames parameter is required and must be an array of strings or string',
          got: fileNames
        },
        400
      )
    }
    const s3instance = await S3(ctx, region)
    const links = {}
    const errors = []
    for (let file of fileNames) {
      if (typeof file !== 'string') {
        error(file + ' is not a string')
        errors.push(file + ' is not a string')
        continue
      }
      links[file] = s3instance.getSignedUrl('getObject', {
        Bucket: bucketName,
        Key: file,
        Expires: EXPIRE
      })
    }
    return response.json({files: links, errors: errors})
  } catch (e) {
    if (e instanceof ErrorWithCode) {
      return response.json({message: e.message}, e.code)
    }
    error(e.stack)
    return response.json({message: e.stack}, 500)
  }
}
