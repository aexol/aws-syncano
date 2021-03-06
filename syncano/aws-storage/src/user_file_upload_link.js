import Server from 'syncano-server';
import {S3, awsDefaultS3Context} from './aws-utils/index';

export default async ctx => {
  const {response} = Server(ctx);
  try {
    const {bucketName, region} = await awsDefaultS3Context(ctx);
    const {name} = ctx.args;
    const {EXPIRE = 60} = ctx.config;
    const {user} = ctx.meta;
    if (typeof user === 'undefined') {
      throw new Error(
        'You must be logged in to read or upload files to this endpoint'
      );
    }
    if (name.indexOf('/') !== -1) {
      throw new Error('You are not allowed to do that');
    }
    const s3instance = await S3(ctx, region);
    const fullName = `${user.id}/${name}`;
    const link = s3instance.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: fullName,
      Expires: EXPIRE,
      ACL: 'private'
    });
    return response.json({link});
  } catch (error) {
    return response.json(error.message, 500);
  }
};
