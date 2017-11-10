import Server from 'syncano-server'
import {S3, awsDefaultS3Context} from 'local-aws-utils'

export default async ctx => {
  const {data, response} = Server(ctx)
  try {
    const {bucketName, region} = await awsDefaultS3Context(ctx)
    const {name, file} = ctx.args
    const {user} = ctx.meta
    if (typeof user === 'undefined') {
      throw new Error(
        'You must be logged in to read or upload files to this endpoint'
      )
    }

    if (name.indexOf('/') !== -1) {
      throw new Error('You are not allowed to do that')
    }
    const fileValue = Buffer.from(file.split(',')[1], 'base64')
    const s3instance = S3(ctx, region)
    const fullName = `${user.id}/${name}`
    const res = await s3instance.putObject(
      {
        Body: fileValue,
        Bucket: bucketName,
        Key: fullName,
        ACL: 'private'
      })
      return response.json({
        res,
        link: `https://s3.${region}.amazonaws.com/${bucketName}/${fullName}`
      })
  } catch (error) {
    return response.json(error.message, 400)
  }
}
