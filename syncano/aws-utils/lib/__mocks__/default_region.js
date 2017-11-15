//__mocks__/default_region.js
'use strict'
const defaultRegion = jest.genMockFromModule('./default_region')
async function awsDefaultRegion(ctx) {
  return 'eu-central-1'
}
async function getRegion(ctx) {
  return 'eu-central-1'
}

defaultRegion.awsDefaultRegion = awsDefaultRegion
defaultRegion.getRegion = getRegion
module.exports = defaultRegion
