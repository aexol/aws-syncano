import Server from 'syncano-server';
import {S3, awsDefaultS3Context, ErrorWithCode} from './aws-utils/index';

export default async ctx => {
  const {response, socket, logger} = Server(ctx);
  const {error} = logger('aws-storage/user_upload');
  try {
    const {bucketName, region} = await awsDefaultS3Context(ctx);
    let {name, file} = ctx.args;
    if (typeof name === 'undefined' || typeof file === 'undefined') {
      return response.json('name and file are required', 400);
    }
    const {user} = ctx.meta;
    if (typeof user === 'undefined') {
      throw new Error(
        'You must be logged in to read or upload files to this endpoint'
      );
    }
    if (name.indexOf('/') !== -1) {
      throw new Error('You are not allowed to do that');
    }
    if (!Buffer.isBuffer(file)) {
      const bSplit = file.split(',');
      file = Buffer.from(bSplit[bSplit.length - 1], 'base64');
    }
    const s3instance = await S3(ctx, region);
    const fullName = `${user.id}/${name}`;
    const res = await s3instance.putObject({
      Body: file,
      Bucket: bucketName,
      Key: fullName,
      ACL: 'private'
    });
    const links = await socket.post('aws-storage/make-links', {
      fileNames: [fullName]
    });
    res.link = links.files[fullName];
    return response.json(res, 200);
  } catch (e) {
    if (e instanceof ErrorWithCode) {
      return response.json({message: e.message}, e.code);
    }
    error(e.stack);
    return response.json({message: e.stack}, 500);
  }
};
