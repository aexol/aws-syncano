import AWS from 'aws-bluebird'
import {awsConfig} from './aws_config'

class S3 extends AWS.S3 {
  constructor(ctx, region) {
    awsConfig = awsConfig({ctx, region})
    super(awsConfig)
    this.awsConfig = awsConfig
  }
}
export {S3}
