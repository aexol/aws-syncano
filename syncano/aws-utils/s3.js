import AWS from 'aws-sdk'
import {awsConfig} from './aws_config'
export default ({ctx,region}) => {
    const conf = awsConfig({ctx,region})
    return new AWS.S3(conf)
}
