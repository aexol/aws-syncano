import Server from 'syncano-server';
import {Lightsail, isAdmin, ErrorWithCode} from 'aws-utils';

export default async ctx => {
  const {data, response, logger} = Server(ctx);
  const {error} = logger('aws-ls@create-ls-instance:');
  try {
    if (!await isAdmin(ctx)) {
      return response.json({message: 'Forbidden'}, 403);
    }
    const ls = new Lightsail(ctx);
    const newInstance = await ls.createInstance();

    let keyPair = data.keypairs.create({
      name: newInstance.keyPair.name,
      privssh: newInstance.keyPair.publicKeyBase64,
      pubssh: newInstance.keyPair.privateKeyBase64,
      region: newInstance.keyPair.region
    });
    let amazonInstances = [];
    for (let i in newInstance.instances) {
      let amazonInstance = newInstance.instances[i];
      amazonInstances.push(
        data.amazon_instances.create({
          name: amazonInstance.instance,
          zone: amazonInstance.zone
        })
      );
    }
    keyPair = (await keyPair).id;
    for (let i in amazonInstances) {
      amazonInstances[i] = (await amazonInstances[i]).id;
    }
    await data.lightsail_instances.create({
      name: ctx.args.name,
      keypair: keyPair,
      blueprint: newInstance.blueprintId,
      bundle: newInstance.bundleId,
      amazonInstances: amazonInstances
    });
    newInstance.name = ctx.args.name;
    return response.json(newInstance, 200);
  } catch (e) {
    if (e instanceof ErrorWithCode) {
      return response.json({message: e.message}, e.code);
    }
    error(e.stack);
    return response.json({message: e.stack, response: e.response}, 500);
  }
};
