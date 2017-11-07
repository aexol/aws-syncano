import AWS from 'aws-sdk'

function awsConfig({ctx, region}) {
  const {AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY} = ctx.config
  const creds = new AWS.Credentials({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
  })
  const config = new AWS.Config({
    region,
    credentials:creds
  })
  return config
}

export {awsConfig}
