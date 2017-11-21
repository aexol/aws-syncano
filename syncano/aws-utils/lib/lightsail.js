import AWS from 'aws-bluebird'
import {awsConfig} from './aws_config'
import {getRegion} from './default_region'
import {getDefaultBundleId} from './lightsail_bundle'
import {AWSUtilsError} from './error'
import * as semver from 'semver'

class Lightsail {
  constructor(ctx) {
    Object.assign(this, ctx)
  }

  async init() {
    if (!this._ls) {
      const region = await getRegion(this)
      this.region = region
      const _awsConfig = await awsConfig({ctx: this, region: this.region})
      this.awsConfig = _awsConfig
      const ls = new AWS.Lightsail(this.awsConfig)
      this._ls = ls
    }
    return this._ls
  }

  async getGroupBlueprints(group) {
    await this.init()
    const data = await this._ls.getBlueprints({includeInactive: false})
    let blueprints = {}
    for (let i = 0; i < data.blueprints.length; i++) {
      if (data.blueprints[i].group === group) {
        blueprints[data.blueprints[i].version] = data.blueprints[i].blueprintId
      }
    }
    return blueprints
  }

  async getGroupBlueprintId(group) {
    await this.init()
    let version =
      this.args && this.args.blueprintVersion ? this.args.blueprintVersion : '*'
    const groupBlueprints = await this.getGroupBlueprints(group)
    const versions = Object.keys(groupBlueprints).sort(semver.rcompare)
    version = semver.validRange(version)
    if (version == null) {
      throw new AWSUtilsError('Invalid version range.')
    }
    return groupBlueprints[semver.maxSatisfying(versions, version)]
  }

  async getWordpressBlueprints() {
    await this.init()
    return this.getGroupBlueprints('wordpress')
  }

  async getWordpressBlueprintId() {
    return this.getGroupBlueprintId('wordpress')
  }

  async getRegion() {
    await this.init()
    const data = await this._ls.getRegions({
      includeAvailabilityZones: true
    })
    for (let i in data.regions) {
      if (data.regions[i].name === this.region) {
        return data.regions[i]
      }
    }
    throw new AWSUtilsError('Invalid region.')
  }

  async getAvailabilityZones() {
    await this.init()
    const region = await this.getRegion()
    let availabilityZones = []
    for (let i in region.availabilityZones) {
      availabilityZones.push(region.availabilityZones[i].zoneName)
    }
    return availabilityZones
  }

  async getBundle() {
    await this.init()
    if (!this.args.bundleId && !this.args.price) {
      this.args.bundleId = await getDefaultBundleId(this)
    }
    const data = await this._ls.getBundles({includeInactive: false})
    const formatFloat = val => parseFloat(val).toFixed(1)
    const compareId = bundle => this.args.bundleId === bundle.bundleId
    const comparePrice = bundle =>
      formatFloat(this.args.price) === formatFloat(bundle.price)
    const checkMatching = bundle =>
      this.args.bundleId ? compareId(bundle) : comparePrice(bundle)
    for (let i in data.bundles) {
      let bundle = data.bundles[i]
      if (checkMatching(bundle)) {
        return bundle
      }
    }
    throw new AWSUtilsError(
      JSON.stringify({
        bundleId: this.args.bundleId,
        price: this.args.price,
        data
      })
    ) //'Could not find a valid bundle.')
  }

  async getBundleId() {
    await this.init()
    let bundle = await this.getBundle()
    return bundle.bundleId
  }

  async createKeyPair() {
    await this.init()
    const keyPairName = await this.getKeyPairName(this.region)
    const kpCResp = await this._ls.createKeyPair({keyPairName: keyPairName})
    const {publicKeyBase64, privateKeyBase64} = kpCResp
    return {
      name: keyPairName,
      publicKeyBase64: publicKeyBase64,
      privateKeyBase64: privateKeyBase64,
      region: this.region
    }
  }

  getInstanceName(zone) {
    const {name} = this.args
    if (!name) {
      throw new AWSUtilsError('name is required.')
    }
    return `${this.meta.instance}-${zone}-${name}`
  }

  async getKeyPairName(region) {
    await this.init()
    return `${this.getInstanceName(region)}-kp`
  }

  async createInstance(group) {
    await this.init()
    if (typeof group === 'undefined') {
      if (typeof this.args.blueprintGroup !== 'undefined') {
        group = this.args.blueprintGroup
      } else {
        throw new AWSUtilsError('blueprintGroup is required', 400)
      }
    }
    let result = {}
    const keyPair = await this.createKeyPair()
    result['keyPair'] = keyPair
    const availabilityZones = await this.getAvailabilityZones()
    const bundleId = await this.getBundleId()
    result['bundleId'] = bundleId
    let zones = this.args && this.args.zones ? this.args.zones : 1
    zones = zones > availabilityZones.length ? availabilityZones.length : zones
    const blueprintId = await this.getGroupBlueprintId(group)
    result['blueprintId'] = blueprintId
    result['instances'] = []
    for (let i = 0; i < zones; i++) {
      const aZone = availabilityZones[i]
      const instanceName = await this.getInstanceName(aZone)
      result['instances'].push({
        instance: instanceName,
        zone: aZone
      })
      await this._ls.createInstances({
        availabilityZone: aZone,
        blueprintId: blueprintId,
        bundleId: bundleId,
        instanceNames: [instanceName]
      })
    }
    return result
  }

  async createWordpressInstance() {
    await this.init()
    return this.createInstance('wordpress')
  }
  async createNodeInstance() {
    await this.init()
    return this.createInstance('node')
  }
}

export {Lightsail}
