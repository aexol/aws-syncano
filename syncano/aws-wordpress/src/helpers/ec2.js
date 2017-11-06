import AWS from 'aws-sdk'
import awsConfig from './config'

var ec2Class = class {
    constructor(ctx, region) {
        this.ctx = ctx
        this.region = region
        this.awsConfig = awsConfig({ctx, region});
        this.ls = new AWS.EC2(this.awsConfig);
    }
}
