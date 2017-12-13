import Server from 'syncano-server';
import {isAdmin, ErrorWithCode} from './aws-utils/index';
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
      entrypoint = 'http',
      domain = '',
      email = ''
    } = args;
    if (entrypoint === 'https') {
      if (!domain || !email) {
        return response.json('Domain and email are required when using https.');
      }
    }
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
      // Create config for etherum instance.
      await data.ethereum_config.create({
        lightsailInstanceName: ctx.args.name,
        envrionment: envrionment,
        bootstrapScript: bootstrapScript,
        entrypoint: entrypoint,
        domain: domain,
        email: email
      });
      const resp = await socket.post('aws-ls/create-ls-instance', args);
      return response.json(resp);
    } catch (e) {
      return response.json(e);
    }
  } catch (e) {
    if (e instanceof ErrorWithCode) {
      return response.json({message: e.message}, e.code);
    }
    error(e.stack);
    return response.json({message: e.stack}, 500);
  }
};
