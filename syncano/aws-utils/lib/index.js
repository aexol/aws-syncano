import {awsConfig} from './aws_config'
import {awsDefaultRegion} from './default_region'
import {awsDefaultBucket} from './default_bucket'
import awsDefaultS3Context from './default_s3_context'
import {isAdmin} from './aws_security'
import {S3} from './s3'
import {Lightsail} from './lightsail'
import {defaultHash, compareHash} from './utils'
import {ErrorWithCode, AWSUtilsError, AWSForbidden} from './error'

function makeid(length = 5) {
  var text = ''
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return text
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
  S3,
  Lightsail,
  ErrorWithCode,
  AWSUtilsError,
  AWSForbidden
}
