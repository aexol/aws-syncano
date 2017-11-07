import AWS from 'aws-sdk'
import Server from 'syncano-server'

function awsConfig({ctx, region}) {
  const {data, logger} = Server(ctx)
  const {debug, error, warn, info} = logger('aws-utils@aws-config:')
  var aws_id;
  try {
      aws_id = data.aws_id.firstOrFail()
  } catch(e) {
      throw {message: "Please install and configure aws-config socket."}
  }
  const {AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY} = aws_id
  const creds = new AWS.Credentials({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
  })
  const config = new AWS.Config({
    region,
    credentials:creds
  })
  error(config)
  return config
}

export {awsConfig}
