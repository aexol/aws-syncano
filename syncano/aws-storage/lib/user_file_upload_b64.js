import Server from 'syncano-server'
import {s3, awsDefaultS3Context} from 'aws-utils'

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

    if(name.indexOf("/") !== -1 ){
      throw new Error("You are not allowed to do that")
    }
    const fileValue = Buffer.from(file.split(',')[1], 'base64')
    const s3instance = s3({ctx, region})
    const fullName = `${user.id}/${name}`
    s3instance.putObject(
      {
        Body: fileValue,
        Bucket: bucketName,
        Key: fullName,
        ACL: 'private'
      },
      function (err, data) {
        if (err) {
          return response.json({err}, 400)
        } else {
          return response.json({
            data,
            link: `https://s3.${region}.amazonaws.com/${bucketName}/${fullName}`
          })
        }
      }
    )
  } catch (error) {
    return response.json(error.message, 400)
  }
}
