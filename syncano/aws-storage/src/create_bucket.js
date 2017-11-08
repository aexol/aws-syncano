import Server from 'syncano-server'
import {S3, isAdmin} from 'local-aws-utils'

export default async ctx => {
  const {data, response} = Server(ctx)
  const {name, region} = ctx.args
  try {
    if (!(await isAdmin(ctx))) {
      throw new Error('Bad amazon key')
    }
    const s3instance = new S3({ctx, region})
    const res = await s3instance.createBucket(
      {
        Bucket: name
      })
    return response.json(res)
  } catch (error) {
    return response.json(error.message, 400)
  }
}
