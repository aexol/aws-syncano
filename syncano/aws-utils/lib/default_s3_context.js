import {awsDefaultBucket} from './default_bucket'
import {awsDefaultRegion} from './default_region'
import {AWSForbidden} from './error'
import {isAdmin} from './aws_security'
import {S3} from './s3'
import Server from 'syncano-server'
export default async ctx => {
  const db = awsDefaultBucket(ctx)
  const dr = awsDefaultRegion(ctx)
  const {data, socket} = Server(ctx)
  // Check if default bucket exists if not create one
  var bucket
  try {
    bucket = await data.bucket.where('name', db).firstOrFail()
  } catch (error) {
    const s3instance = await S3(ctx, dr)
    const res = await s3instance.createBucket({
      Bucket: db
    })
    bucket = await data.bucket.create({name: db, region: dr})
  }
  const {AMAZON_KEY, bucketName = db, region = dr} = ctx.args
  // If somebody wants to enter another socket or bucket AMAZON_KEY is needed as argument
  if (bucketName !== db || region !== dr) {
    if (!await isAdmin(ctx)) {
      throw new AWSForbidden(
        'You are not allowed to perform operations on this region or bucket. Pass AMAZON_KEY to do that'
      )
    }
  }
  return {
      bucketName: bucket.name,
      region: bucket.region 
  }
}
