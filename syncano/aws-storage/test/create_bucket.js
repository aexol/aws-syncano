import {bucket} from './fakedata/index'
import {run} from 'syncano-test'
import {assert} from 'chai'
describe('create profile', function() {
  const params = bucket()
  it('correct', async () => {
    const res = await run('create_bucket', {
      args: {
        ...params,
        AMAZON_KEY: 'ddd'
      },
      config: {
        AMAZON_KEY: 'ddd'
      }
    })
    assert.propertyVal(res, 'code', 200)
    assert.propertyVal(res, 'mimetype', 'application/json')
  })
  it('incorrect', async () => {
    const res = await run('create_profile', {
      args: {...params, email: undefined}
    })
    assert.propertyVal(res, 'code', 400)
    assert.propertyVal(res, 'mimetype', 'application/json')
  })
})
