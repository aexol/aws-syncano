import Server from 'syncano-server'
import {S3, awsDefaultS3Context} from 'local-aws-utils'

export default async ctx => {
  const {data, response} = Server(ctx)
  try {
    const {bucketName, region} = await awsDefaultS3Context(ctx)
    const {name, file} = ctx.args
    const fileValue = Buffer.from(file.split(',')[1], 'base64')
    if (name.indexOf('/') !== -1) {
      throw new Error('You are not allowed to do that')
    }
    const s3instance = S3(ctx, region)
    const res = await s3instance.putObject(
      {
        Body: fileValue,
        Bucket: bucketName,
        Key: name,
        ACL: 'public-read'
      })
    return response.json(res)
  } catch (error) {
    return response.json(error.message, 400)
  }
}
