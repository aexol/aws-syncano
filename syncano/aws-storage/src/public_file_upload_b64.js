import Server from 'syncano-server'
import AWS from 'aws-sdk'
import s3 from './helpers/s3'
import defaultS3Context from './helpers/default_s3_context'
export default async ctx => {
  const {data, response} = Server(ctx)
  try {
    const {bucketName, region} = await defaultS3Context(ctx)
    const {name, file} = ctx.args
    const fileValue = Buffer.from(file.split(',')[1], 'base64')
    if (name.indexOf('/') !== -1) {
      throw new Error('You are not allowed to do that')
    }
    const s3instance = s3({ctx, region})
    s3instance.putObject(
      {
        Body: fileValue,
        Bucket: bucketName,
        Key: name,
        ACL: 'public-read'
      },
      function (err, data) {
        if (err) {
          return response.json({err}, 400)
        } else {
          return response.json({
            data,
            link: `https://s3.${region}.amazonaws.com/${bucketName}/${name}`
          })
        }
      }
    )
  } catch (error) {
    return response.json(error.message, 400)
  }
}
