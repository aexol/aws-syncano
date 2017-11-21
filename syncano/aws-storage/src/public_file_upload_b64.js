import Server from 'syncano-server'
import {S3, awsDefaultS3Context} from 'aws-utils'

export default async ctx => {
  const {response, logger} = Server(ctx)
  const {error} = logger('aws-storage/upload')
  try {
    const {bucketName, region} = await awsDefaultS3Context(ctx)
    const {name, file} = ctx.args
    const bSplit = file.split(',')
    const fileValue = Buffer.from(bSplit[bSplit.length - 1], 'base64')
    if (name.indexOf('/') !== -1) {
      throw new Error('You are not allowed to do that')
    }
    const s3instance = await S3(ctx, region)
    await s3instance.putObject({
      Body: fileValue,
      Bucket: bucketName,
      Key: name,
      ACL: 'public-read'
    })
    return response.json(
      {message: `https://s3.${region}.amazonaws.com/${bucketName}/${name}`},
      200
    )
  } catch (e) {
    error(e.stack)
    return response.json({message: e.stack}, 500)
  }
}
