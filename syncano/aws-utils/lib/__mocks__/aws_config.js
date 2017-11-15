//__mocks__/aws_config.js
'use strict'
const awsConfigMod = jest.genMockFromModule('./aws_config')
function awsConfig(params) {
  return {
    credentials: {accessKeyId: 'keyId', secretAccessKey: 'secret'},
    region: 'eu-central-1'
  }
}

awsConfigMod.awsConfig = awsConfig
module.exports = awsConfigMod
