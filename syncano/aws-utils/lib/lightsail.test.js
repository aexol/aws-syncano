import {Lightsail} from './lightsail'
import AWS from 'aws-bluebird'

jest.mock('./default_region')
jest.mock('./aws_config')
jest.mock('./lightsail_bundle.js')
jest.mock('aws-bluebird')

test('constructor', async () => {
  return expect(new Lightsail({key: 'val'})).toEqual({key: 'val'})
})

test('init', async () => {
  let ls = new Lightsail()
  return expect(await ls.init()).toEqual({
    credentials: {accessKeyId: 'keyId', secretAccessKey: 'secret'},
    region: 'eu-central-1'
  })
})

let wordpressBlueprints = [
  {
    group: 'wordpress',
    version: '1.0.0',
    blueprintId: 'wordpress_1_0_0'
  },
  {
    group: 'wordpress',
    version: '2.0.0',
    blueprintId: 'wordpress_2_0_0'
  }
]
let nginxBlueprints = [
  {
    group: 'ngixn',
    version: '1.0.0',
    blueprintId: 'nginx_1_0_0'
  },
  {
    group: 'nginx',
    version: '2.0.0',
    blueprintId: 'nginx_2_0_0'
  }
]
let blueprints = [].concat(wordpressBlueprints).concat(nginxBlueprints)

let regions = [
  {
    name: 'eu-central-1',
    availabilityZones: [
      {
        zoneName: 'eu-central-1a'
      },
      {
        zoneName: 'eu-central-1b'
      }
    ]
  },
  {
    name: 'us-east-1',
    availabilityZones: [
      {
        zoneName: 'us-east-1a'
      },
      {
        zoneName: 'us-east-1b'
      }
    ]
  }
]

let bundles = [
  {
    bundleId: 'micro_1_0',
    price: '10.0'
  },
  {
    bundleId: 'nano_1_0',
    price: '5.0'
  }
]

describe('blueprints api tests', () => {
  beforeEach(() => {
    AWS.__setBlueprints(blueprints)
  })
  test('getGroupBlueprints', async () => {
    let ls = new Lightsail()
    return expect(await ls.getGroupBlueprints('wordpress')).toEqual(
      (() => {
        let wb = {}
        for (let i in wordpressBlueprints) {
          wb[wordpressBlueprints[i].version] =
            wordpressBlueprints[i].blueprintId
        }
        return wb
      })()
    )
  })

  test('getGroupBlueprintId', async () => {
    let ls = new Lightsail()
    return expect(await ls.getGroupBlueprintId('wordpress')).toEqual(
      'wordpress_2_0_0'
    )
  })

  test('getGroupBlueprintId with version', async () => {
    let ls = new Lightsail({args: {blueprintVersion: '1.0.0'}})
    return expect(await ls.getGroupBlueprintId('wordpress')).toEqual(
      'wordpress_1_0_0'
    )
  })

  test('getWordpressBlueprints', async () => {
    let ls = new Lightsail()
    return expect(await ls.getWordpressBlueprints()).toEqual(
      (() => {
        let wb = {}
        for (let i in wordpressBlueprints) {
          wb[wordpressBlueprints[i].version] =
            wordpressBlueprints[i].blueprintId
        }
        return wb
      })()
    )
  })

  test('getWordpressBlueprintId', async () => {
    let ls = new Lightsail()
    return expect(await ls.getWordpressBlueprintId()).toEqual('wordpress_2_0_0')
  })

  test('getWordpressBlueprintId with version', async () => {
    let ls = new Lightsail({args: {blueprintVersion: '1.0.0'}})
    return expect(await ls.getWordpressBlueprintId()).toEqual('wordpress_1_0_0')
  })
})

describe('regions api tests', () => {
  beforeEach(() => {
    AWS.__setRegions(regions)
  })

  test('getRegion', async () => {
    let ls = new Lightsail()
    ls.region = 'eu-central-1'
    return expect(await ls.getRegion()).toEqual(regions[0])
  })

  test('getAvailabilityZones', async () => {
    let ls = new Lightsail()
    return expect(await ls.getAvailabilityZones()).toEqual(
      (() => {
        let azones = []
        for (let i in regions[0].availabilityZones) {
          azones.push(regions[0].availabilityZones[i].zoneName)
        }
        return azones
      })()
    )
  })
})

describe('bundles api tests', () => {
  beforeEach(() => {
    AWS.__setBundles(bundles)
  })

  test('getBundle by id', async () => {
    let ls = new Lightsail({args: {bundleId: 'nano_1_0'}})
    return expect(await ls.getBundle()).toEqual({
      bundleId: 'nano_1_0',
      price: '5.0'
    })
  })

  test('getBundle by price', async () => {
    let ls = new Lightsail({args: {price: '5.0'}})
    return expect(await ls.getBundle()).toEqual({
      bundleId: 'nano_1_0',
      price: '5.0'
    })
  })

  test('getBundleId by id', async () => {
    let ls = new Lightsail({args: {bundleId: 'nano_1_0'}})
    return expect(await ls.getBundleId()).toEqual('nano_1_0')
  })

  test('getBundle by price', async () => {
    let ls = new Lightsail({args: {price: '5.0'}})
    return expect(await ls.getBundleId()).toEqual('nano_1_0')
  })
})

describe('keypair and name tests', () => {
  test('createKeyPair', async () => {
    let ls = new Lightsail({
      args: {name: 'name'},
      meta: {instance: 'inst1'}
    })
    return expect(await ls.createKeyPair()).toEqual({
      name: 'inst1-eu-central-1-name-kp',
      publicKeyBase64: 'PUBSSH',
      privateKeyBase64: 'PRIVSSH',
      region: 'eu-central-1'
    })
  })

  test('getInstanceName', () => {
    let ls = new Lightsail({
      args: {name: 'name'},
      meta: {instance: 'inst1'}
    })
    expect(ls.getInstanceName('zzzone')).toEqual('inst1-zzzone-name')
  })

  test('getKeyPairName', async () => {
    let ls = new Lightsail({
      args: {name: 'name'},
      meta: {instance: 'inst1'}
    })
    return expect(await ls.getKeyPairName('rreg')).toEqual('inst1-rreg-name-kp')
  })
})

describe('Lightsail instance creation tests', () => {
  beforeEach(() => {
    AWS.__setBlueprints(blueprints)
    AWS.__setRegions(regions)
    AWS.__setBundles(bundles)
  })
  test('createInstance default', async () => {
    let ls = new Lightsail({
      args: {name: 'name'},
      meta: {instance: 'inst1'}
    })
    return expect(await ls.createInstance('wordpress')).toEqual({
      keyPair: {
        name: 'inst1-eu-central-1-name-kp',
        publicKeyBase64: 'PUBSSH',
        privateKeyBase64: 'PRIVSSH',
        region: 'eu-central-1'
      },
      blueprintId: 'wordpress_2_0_0',
      bundleId: 'micro_1_0',
      instances: [
        {
          instance: `inst1-eu-central-1a-name`,
          zone: 'eu-central-1a'
        }
      ]
    })
  })

  test('createInstance default with bundleId', async () => {
    let ls = new Lightsail({
      args: {name: 'name', bundleId: 'nano_1_0'},
      meta: {instance: 'inst1'}
    })
    return expect(await ls.createInstance('wordpress')).toEqual({
      keyPair: {
        name: 'inst1-eu-central-1-name-kp',
        publicKeyBase64: 'PUBSSH',
        privateKeyBase64: 'PRIVSSH',
        region: 'eu-central-1'
      },
      blueprintId: 'wordpress_2_0_0',
      bundleId: 'nano_1_0',
      instances: [
        {
          instance: `inst1-eu-central-1a-name`,
          zone: 'eu-central-1a'
        }
      ]
    })
  })

  test('createInstance default with blueprintVersion', async () => {
    let ls = new Lightsail({
      args: {name: 'name', blueprintVersion: '1.0.0'},
      meta: {instance: 'inst1'}
    })
    return expect(await ls.createInstance('wordpress')).toEqual({
      keyPair: {
        name: 'inst1-eu-central-1-name-kp',
        publicKeyBase64: 'PUBSSH',
        privateKeyBase64: 'PRIVSSH',
        region: 'eu-central-1'
      },
      blueprintId: 'wordpress_1_0_0',
      bundleId: 'micro_1_0',
      instances: [
        {
          instance: `inst1-eu-central-1a-name`,
          zone: 'eu-central-1a'
        }
      ]
    })
  })

  test('createInstance default with multiple zones', async () => {
    let ls = new Lightsail({
      args: {name: 'name', blueprintVersion: '1.0.0', zones: 2},
      meta: {instance: 'inst1'}
    })
    return expect(await ls.createInstance('wordpress')).toEqual({
      keyPair: {
        name: 'inst1-eu-central-1-name-kp',
        publicKeyBase64: 'PUBSSH',
        privateKeyBase64: 'PRIVSSH',
        region: 'eu-central-1'
      },
      blueprintId: 'wordpress_1_0_0',
      bundleId: 'micro_1_0',
      instances: [
        {
          instance: `inst1-eu-central-1a-name`,
          zone: 'eu-central-1a'
        },
        {
          instance: `inst1-eu-central-1b-name`,
          zone: 'eu-central-1b'
        }
      ]
    })
  })
})
