import {awsConfig} from './aws_config'
import Server from 'syncano-server'
jest.mock('syncano-server')

beforeEach(() => {
  Server().__setDataClasses(['aws_id'])
})

test('get config', async () => {
  Server().__setFirstId({
    AWS_ACCESS_KEY_ID: 'keyId',
    AWS_SECRET_ACCESS_KEY: 'secret'
  })
  return expect(await awsConfig({ctx: {}, region: 'eu-central-1'})).toEqual({
    credentials: {
      accessKeyId: 'keyId',
      secretAccessKey: 'secret'
    },
    region: 'eu-central-1'
  })
})
