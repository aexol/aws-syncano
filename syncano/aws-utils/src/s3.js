import AWS from 'aws-bluebird'
import {awsConfig} from './aws_config'

async function S3(ctx, server, region) {
    const _awsConfig = await awsConfig({ctx, server, region})
    return new AWS.S3(_awsConfig)
}
export {S3}
