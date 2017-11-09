import AWS from 'aws-sdk'
import {awsConfig} from './aws_config'

class EC2 {
  constructor(ctx, region) {
    this.ctx = ctx
    this.region = region
    this.awsConfig = awsConfig({ctx, region})
    this.ls = new AWS.EC2(this.awsConfig)
  }
}
export {EC2}
