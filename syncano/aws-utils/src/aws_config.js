import AWS from 'aws-sdk'
import Server from 'syncano-server'
import {AWSUtilsError} from './error'

function awsConfig({ctx, region}) {
  const {data, logger} = Server(ctx)
  const {error} = logger('aws-utils@aws-config:')
  var awsId
  try {
    awsId = data.aws_id.firstOrFail()
  } catch (e) {
    error(e)
    throw new AWSUtilsError('Please install and configure aws-config socket.')
  }
  const {AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY} = awsId
  const creds = new AWS.Credentials({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
  })
  const config = new AWS.Config({
    region,
    credentials: creds
  })
  error(config)
  return config
}

export {awsConfig}
