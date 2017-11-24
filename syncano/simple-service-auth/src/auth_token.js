import Server from 'syncano-server';
import {isAdmin, ErrorWithCode} from 'aws-utils';

// Simply returns 200 OK if everything went ok
// Anything else, including any kind of error
// will return 403.
export default async ctx => {
  const {response, data} = Server(ctx);
  try {
    let key = ctx.args.SERVICE_TOKEN
      ? ctx.args.SERVICE_TOKEN
      : ctx.meta.request.HTTP_SERVICE_TOKEN;
    if (!key) {
      return response.json('', 403);
    }
    let token = await data.ssa_token.where('token', key).firstOrFail();
    if (new Date() > new Date(token.expire)) {
      return response.json('', 403);
    }
    // Expire used token
    // Overkill?
    await data.ssa_token.update(token.id, {expire: new Date(0)});
    return response.json('', 200);
  } catch (e) {
    return response.json('', 403);
  }
};
