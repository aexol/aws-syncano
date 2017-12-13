import Server from 'syncano-server';
import {isAdmin, ErrorWithCode} from './aws-utils/index';
import crypto from 'crypto';

async function newToken(data) {
  let token;
  // Loop while token is not unique
  // TODO: some kind of backoff. Though collisions shouldn't really happen
  while (true) {
    try {
      token = crypto.randomBytes(32).toString('hex');
      await data.ssa_token.where('token', token).firstOrFail();
    } catch (e) {
      return token;
    }
  }
}

async function create_token(ctx) {
  const {response, data, logger} = Server(ctx);
  if (!await isAdmin) {
    return response.json({message: 'Forbidden'}, 403);
  }
  const {error} = logger('simple-service-auth/create-token');
  try {
    const token = await newToken(data);
    // Expire token after X seconds.
    let {expire = 300} = ctx.args;
    let expireDate = new Date();
    expireDate.setSeconds(expireDate.getSeconds() + expire);
    try {
      await data.ssa_token.create({
        token: token,
        expire: expireDate
      });
    } catch (e) {
      return response.json(e.response.data, e.response.status);
    }
    return response.json({token}, 200);
  } catch (e) {
    if (e instanceof ErrorWithCode) {
      return response.json({message: e.message}, e.code);
    }
    error(e.stack);
    return response.json({message: e.stack}, 500);
  }
}
export default create_token;
