//__mocks__/aws-sdk.js
'use strict'
const AWS = jest.genMockFromModule('aws-sdk');

function Credentials(params) {
    return params
}

function Config(params) {
    return params
}

AWS.Credentials = Credentials
AWS.Config = Config

module.exports = AWS
