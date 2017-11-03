import AWS from 'aws-sdk'
import config from './config'
export default ({ctx,region}) => {
    const conf = config({ctx,region})
    return new AWS.S3(conf)
}