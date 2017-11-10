import Server from 'syncano-server'
import {S3, awsDefaultS3Context} from 'local-aws-utils'

export default async ctx => {
  const {response} = Server(ctx)
  try {
    const {user} = ctx.meta
    const {bucketName, region} = await awsDefaultS3Context(ctx)
    const {name} = ctx.args
    const {EXPIRE = 60} = ctx.config
    if (typeof user === 'undefined') {
      throw new Error(
        'You must be logged in to read or upload files to this endpoint'
      )
    }
    if (name.indexOf('/') !== -1) {
      throw new Error('You are not allowed to do that')
    }
    const s3instance = S3(ctx, region)
    const fullName = `${user.id}/${name}`
    const link = s3instance.getSignedUrl('getObject', {
      Bucket: bucketName,
      Key: fullName,
      Expires: EXPIRE
    })
    return response.json({link})
  } catch (error) {
    return response.json(error.message, 400)
  }
}
