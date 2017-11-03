import Server from 'syncano-server'
import AWS from 'aws-sdk'
import s3 from './helpers/s3'
import defaultS3Context from './helpers/default_s3_context'
export default async ctx => {
  const {data, response} = Server(ctx)
  try {
    const {user} = ctx.meta
    const {bucketName, region} = await defaultS3Context(ctx)
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
    const s3instance = s3({ctx, region})
    const fullName = `${user.id}/${name}`
    const link = s3instance.getSignedUrl('getObject',{
      Bucket: bucketName,
      Key: fullName,
      Expires: EXPIRE
    })
    return response.json({link})
  } catch (error) {
    return response.json(error.message, 400)
  }
}
