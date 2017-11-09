import {awsDefaultBucket} from './default_bucket'
import {awsDefaultRegion} from './default_region'
import {AWSForbidden} from './error'
import Server from 'syncano-server'
export default async ctx => {
  const db = awsDefaultBucket(ctx)
  const dr = awsDefaultRegion(ctx)
  const {data, socket} = Server(ctx)
  // Check if default bucket exists if not create one
  try {
    await data.bucket.where('name', db).firstOrFail()
  } catch (error) {
    await socket.get('aws-storage/create_bucket', {
      name: db,
      region: dr,
      AMAZON_KEY: ctx.config.AMAZON_KEY
    })
  }
  const {AMAZON_KEY, bucketName = db, region = dr} = ctx.args
  // If somebody wants to enter another socket or bucket AMAZON_KEY is needed as argument
  if (bucketName !== db || region !== dr) {
    if (AMAZON_KEY !== ctx.config.AMAZON_KEY) {
      throw new AWSForbidden(
        'You are not allowed to perform operations on this region or bucket. Pass AMAZON_KEY to do that'
      )
    }
  }
  return {
    bucketName,
    region
  }
}
