import Server from 'syncano-server';
import nodeFetch from 'node-fetch';
import {defaultAuth, defaultBootstrap} from './helpers/defaults';

async function isValidURL(url) {
  const res = await nodeFetch(url, {method: 'HEAD'});
  return res.status != 404;
}

export default async ctx => {
  const {response, instance, data} = Server(ctx);
  let config = {
    environment: 'development',
    authUrl: defaultAuth(ctx, instance),
    bootstrapScript: defaultBootstrap(ctx, instance),
    method: 'https',
    address: ':443'
  };
  const {ethereumInstanceName} = ctx.args;
  if (ethereumInstanceName) {
    try {
      dConfig = data.ethereum_config
        .where('lightsailInstanceName', ethereumInstanceName)
        .firstOrFail();
      Object.assign(config, dConfig);
    } catch (e) {}
  }
  if (!await isValidURL(config.authUrl)) {
    return response.json(
      {
        message:
          'authUrl returned 404, either set authUrl config to correct value or install simple-service-auth socket.'
      },
      400
    );
  }
  if (!await isValidURL(config.bootstrapScript)) {
    return response.json(
      {
        message:
          'bootstrapScript returned 404, if you did not override bootstrapScript configuration file an issue with a socket'
      },
      400
    );
  }
  return response(
    `export ENVIRONMENT="${config.environment}"
export AUTH_URL="${config.authUrl}"
export BOOTSTRAP_SCRIPT="${config.bootstrapScript}"
export METHOD="${config.method}"
export ADDRESS="${config.address}"
`,
    200,
    'text/plain',
    {}
  );
};
