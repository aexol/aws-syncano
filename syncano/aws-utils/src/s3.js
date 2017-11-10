import AWS from 'aws-bluebird'
import {awsConfig} from './aws_config'

async function S3(ctx, region) {
    const _awsConfig = await awsConfig({ctx, region})
    return new AWS.S3(_awsConfig)
}
export {S3}
