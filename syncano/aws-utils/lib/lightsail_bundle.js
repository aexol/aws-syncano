import Server from 'syncano-server'

async function getDefaultBundleId(ctx) {
  const {data} = Server(ctx)
  try {
    return (await data.aws_config
      .where('key', 'LIGHTSAIL_BUNDLE_ID')
      .firstOrFail()).value
  } catch (e) {}
  return 'micro_1_0'
}

export {getDefaultBundleId}
