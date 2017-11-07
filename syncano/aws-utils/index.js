import {awsConfig} from './aws_config.js'
import {awsDefaultRegion} from './default_region.js'
import {awsDefaultBucket} from './default_bucket.js'
import {awsDefaultS3Context} from './default_s3_context.js'
import {isAdmin} from './aws_security.js'
import {s3} from './s3.js'
import {defaultHash, compareHash} from './utils.js'

function makeid(length) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

export {
    makeid,
    awsConfig,
    awsDefaultRegion,
    awsDefaultBucket,
    awsDefaultS3Context,
    isAdmin,
    defaultHash,
    compareHash,
    s3
};
