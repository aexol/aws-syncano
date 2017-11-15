//__mocks__/lightsail_bundle.js
'use strict'
const lightsailBundle = jest.genMockFromModule('./lightsail_bundle')
async function getDefaultBundleId(ctx) {
  return 'micro_1_0'
}

lightsailBundle.getDefaultBundleId = getDefaultBundleId
module.exports = lightsailBundle
