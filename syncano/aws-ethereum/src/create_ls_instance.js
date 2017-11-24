import Server from 'syncano-server';
import {isAdmin, ErrorWithCode} from 'aws-utils';
import {
  defaultEnvironment,
  defaultBootstrap,
  defaultAuth
} from './helpers/defaults';

export default async ctx => {
  const {data, instance, logger, response, socket} = Server(ctx);
  const {error} = logger('aws-node@create-ls-instance:');
  try {
    if (!await isAdmin(ctx)) {
      return response.json({message: 'Forbidden'}, 403);
    }
    let args = ctx.args;
    const {
      envrionment = 'development',
      authUrl = defaultAuth(ctx, instance),
      bootstrapScript = defaultBootstrap(ctx, instance),
      method = 'https',
      address = ':443'
    } = args;
    args.userData = `#!/bin/sh
apt -y update && apt -y install curl
curl -X GET ${defaultEnvironment(ctx, instance)} > /env.sh
. /env.sh
curl -X GET \${BOOTSTRAP_SCRIPT} | base64 -d | gzip -d > /bootstrap.sh
chmod +x /bootstrap.sh
/bootstrap.sh
`;
    args.blueprintGroup = 'ubuntu';
    args.blueprintVersion = '16.04 LTS';
    try {
      const resp = await socket.post('aws-ls/create-ls-instance', args);
      await data.ethereum_config.create({
        lightsailInstanceName: ctx.args.name,
        envrionment: envrionment,
        bootstrapScript: bootstrapScript,
        method: method,
        address: addres
      });
      return response.json(resp);
    } catch (e) {
      return response.json(e.response.data, e.response.status);
    }
  } catch (e) {
    if (e instanceof ErrorWithCode) {
      return response.json({message: e.message}, e.code);
    }
    error(e.stack);
    return response.json({message: e.stack}, 500);
  }
};
