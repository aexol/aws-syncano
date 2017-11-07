import Server from 'syncano-server'
import {s3} from 'aws-utils'

export default async ctx => {
  const {data, response} = Server(ctx)
  const {name, region, AMAZON_KEY} = ctx.args
  try {
    if (AMAZON_KEY !== ctx.config.AMAZON_KEY) {
      throw new Error('Bad amazon key')
    }
    const s3instance = s3({ctx, region})
    s3instance.createBucket(
      {
        Bucket: name
      },
      async function (err, res) {
        if (err) {
          return response.json({err}, 400)
        } else {
          const newBucketClass = await data.bucket.create({name})
          return response.json(res)
        }
      }
    )
  } catch (error) {
    return response.json(error.message, 400)
  }
}
