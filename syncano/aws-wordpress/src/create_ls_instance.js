import Server from 'syncano-server'
import {Lightsail, isAdmin, ErrorWithCode} from 'aws-utils'

export default async ctx => {
  const {data, response, logger} = Server(ctx)
  const {error} = logger('aws-wordpress@create-ls-instance:')
  try {
    if (!await isAdmin(ctx)) {
      return response.json({message: 'Forbidden'}, 403)
    }
    const ls = new Lightsail(ctx)
    const newWordpressInstance = await ls.createWordpressInstance()

    let keyPair = data.keypairs.create({
      name: newWordpressInstance.keyPair.name,
      privssh: newWordpressInstance.keyPair.publicKeyBase64,
      pubssh: newWordpressInstance.keyPair.privateKeyBase64,
      region: newWordpressInstance.keyPair.region
    })
    let amazonInstances = []
    for (let i in newWordpressInstance.instances) {
      let amazonInstance = newWordpressInstance.instances[i]
      amazonInstances.push(
        data.amazon_instances.create({
          name: amazonInstance.instance,
          zone: amazonInstance.zone
        })
      )
    }
    keyPair = (await keyPair).id
    for (let i in amazonInstances) {
      amazonInstances[i] = (await amazonInstances[i]).id
    }
    await data.lightsail_instances.create({
      name: ctx.args.name,
      keypair: keyPair,
      blueprint: newWordpressInstance.blueprintId,
      bundle: newWordpressInstance.bundleId,
      amazonInstances: amazonInstances
    })
    return response.json(newWordpressInstance, 200)
  } catch (e) {
    if (e instanceof ErrorWithCode) {
      return response.json({message: e.message}, e.code)
    }
    error(e.stack)
    return response.json({message: e.stack}, 500)
  }
}
