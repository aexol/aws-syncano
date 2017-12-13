import Server from 'syncano-server';
import {isAdmin, ErrorWithCode} from './aws-utils/index.js';

export default async ctx => {
  const server = Server(ctx);
  const {response, data, logger} = server;
  const {error} = logger('aws-config/install');
  try {
    if (!await isAdmin) {
      return response.json({message: 'go away'}, 403);
    }
    if (
      ctx.args.AWS_ACCESS_KEY_ID.length === 0 ||
      ctx.args.AWS_SECRET_ACCESS_KEY.length === 0
    ) {
      return response.json({message: 'Oops'}, 400);
    }
    var awsId = await data.aws_id.firstOrCreate({}, {});
    await data.aws_id.update(awsId.id, {
      AWS_ACCESS_KEY_ID: ctx.args.AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY: ctx.args.AWS_SECRET_ACCESS_KEY
    });
    const region = ctx.args.REGION ? ctx.args.REGION : 'eu-central-1';
    await data.aws_config.updateOrCreate(
      {key: 'REGION'},
      {key: 'REGION', value: region}
    );
    return response.json({message: 'Installed'}, 200);
  } catch (e) {
    if (e instanceof ErrorWithCode) {
      return response.json({message: e.message}, e.code);
    }
    error(e);
    return response.json({message: 'Internal Server Error'}, 501);
  }
};
