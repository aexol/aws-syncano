import Server from 'syncano-server'
async function awsDefaultRegion(ctx) {
  try {
    const {data} = Server(ctx)
    return (await data.aws_config.where('key', 'REGION').firstOrFail()).value
  } catch (e) {}
  return 'eu-central-1'
}

async function getRegion(ctx) {
  return ctx.args.region ? ctx.args.region : awsDefaultRegion(ctx)
}

export {getRegion, awsDefaultRegion}
