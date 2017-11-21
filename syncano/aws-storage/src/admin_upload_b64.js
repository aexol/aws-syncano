import Server from 'syncano-server'
import {S3, awsDefaultS3Context, isAdmin, ErrorWithCode} from 'aws-utils'

export default async ctx => {
  const {response, socket, logger} = Server(ctx)
  const {error} = logger('aws-storage/admin-upload')
  try {
    if (!await isAdmin(ctx)) {
      return response.json('Forbidden', 403)
    }
    const {bucketName, region} = await awsDefaultS3Context(ctx)
    let {name, file} = ctx.args
    if (typeof name === 'undefined' || typeof file === 'undefined') {
      return response.json('name and file are required', 400)
    }
    if (!Buffer.isBuffer(file)) {
      const bSplit = file.split(',')
      file = Buffer.from(bSplit[bSplit.length - 1], 'base64')
    }
    const s3instance = await S3(ctx, region)
    const res = await s3instance.putObject({
      Body: file,
      Bucket: bucketName,
      Key: name,
      ACL: 'private'
    })
    const links = await socket.post('aws-storage/make-links', {
      fileNames: [name]
    })
    res.link = links.files[name]
    return response.json(res, 200)
  } catch (e) {
    if (e instanceof ErrorWithCode) {
      return response.json({message: e.message}, e.code)
    }
    error(e.stack)
    return response.json({message: e.stack}, 500)
  }
}
