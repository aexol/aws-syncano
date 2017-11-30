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
    entrypoint: 'https',
    domain: '',
    email: ''
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
  let baseEnv = `export ENVIRONMENT="${config.environment}"
export AUTH_URL="${config.authUrl}"
export BOOTSTRAP_SCRIPT="${config.bootstrapScript}"
export ENTRYPOINT="${config.entrypoint}"
`;
  // EXPORT domain if configured
  if (config.domain) {
    baseEnv = `${baseEnv}export FRONTEND_RULE="Host:${config.domain}"
`;
  } else {
    baseEnv = `${baseEnv}export FRONTEND_RULE="Path:/"
`;
  }
  // EXPORT email if configured
  if (config.email) {
    baseEnv = `export EMAIL="${config.email}"
`;
  }
  return response(baseEnv, 200, 'text/plain', {});
};
