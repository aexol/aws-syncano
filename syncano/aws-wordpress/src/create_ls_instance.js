import Server from 'syncano-server';
import {isAdmin, ErrorWithCode} from './aws-utils/index';

export default async ctx => {
  const {response, logger, socket} = Server(ctx);
  const {error} = logger('aws-wordpress@create-ls-instance:');
  try {
    if (!await isAdmin(ctx)) {
      return response.json({message: 'Forbidden'}, 403);
    }
    let args = ctx.args;
    args.blueprintGroup = 'wordpress';
    try {
      const resp = await socket.post('aws-ls/create-ls-instance', args);
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
