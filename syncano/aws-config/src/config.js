import Server from 'syncano-server'

async function getValue (ctx, key) {
  try {
    const {data} = Server(ctx)
    return await data.aws_config.where('key', key).firstOrFail()
  } catch (e) {}
  return null
}

async function setValue (ctx, key, value) {
  const {data} = Server(ctx)
  return data.aws_config.updateOrCreate({key}, {key, value})
}

export {getValue, setValue}
