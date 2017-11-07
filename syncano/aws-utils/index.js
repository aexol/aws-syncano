import {awsConfig} from './aws_config.js'
import {awsDefaultRegion} from './default_region.js'
import {awsDefaultBucket} from './default_bucket.js'
import {awsDefaultS3Context} from './default_s3_context.js'
import {s3} from './s3.js'
function foo() {
    return "Hello world!!";
}

export {
    foo,
    awsConfig,
    awsDefaultRegion,
    awsDefaultBucket,
    awsDefaultS3Context,
    s3
};
