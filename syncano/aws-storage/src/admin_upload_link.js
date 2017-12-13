import Server from 'syncano-server';
import {
  S3,
  awsDefaultS3Context,
  isAdmin,
  ErrorWithCode
} from './aws-utils/index';

export default async ctx => {
  const {response, logger} = Server(ctx);
  const {error} = logger('aws-storage/admin-upload-link');
  try {
    if (!await isAdmin(ctx)) {
      return response.json('Forbidden', 403);
    }
    const {bucketName, region} = await awsDefaultS3Context(ctx);
    const {name} = ctx.args;
    const {EXPIRE = 60} = ctx.config;
    const s3instance = await S3(ctx, region);
    const link = s3instance.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: name,
      Expires: EXPIRE,
      ACL: 'private'
    });
    return response.json({link}, 200);
  } catch (e) {
    if (e instanceof ErrorWithCode) {
      return response.json({message: e.message}, e.code);
    }
    error(e.stack);
    return response.json({message: e.stack}, 500);
  }
};
