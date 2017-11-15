import {getDefaultBundleId} from './lightsail_bundle.js'
import Server from 'syncano-server'
jest.mock('syncano-server')

beforeEach(() => {
  Server().__setDataClasses(['aws_config'])
})

test('test configured default bundle', async () => {
  Server().__setFirstId({
    key: 'LIGHTSAIL_BUNDLE_ID',
    value: 'nano_1_0'
  })
  return expect(await getDefaultBundleId()).toEqual('nano_1_0')
})

test('test fallback default bundle', async () => {
  Server().__setFirstId()
  return expect(await getDefaultBundleId()).toEqual('micro_1_0')
})
