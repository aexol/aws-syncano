import AWS from 'aws-bluebird'
import {awsConfig} from './aws_config'
import {AWSUtilsError} from './error'
import * as semver from 'semver'

class Lightsail extends AWS.Lightsail {
  constructor(ctx, region) {
    awsConfig = awsConfig({ctx, region})
    super(awsConfig)
    this.ctx = ctx
    this.region = region
    this.awsConfig = awsConfig
  }

  async getGroupBlueprints(group) {
    const data = await this.getBlueprints()
    var blueprints = {}
    for (var i = 0; i < data.blueprints.length; i++) {
      if (data.blueprints[i].group === group) {
        blueprints[data.blueprints[i].version] = data.blueprints[i].blueprintId
      }
    }
    return blueprints
  }

  async getWordpressBlueprints() {
    return this.getGroupBlueprints('wordpress')
  }

  async getWordpressBlueprintId(version) {
    const wordpressBlueprints = await this.getWordpressBlueprints()
    const versions = Object.keys(wordpressBlueprints).sort(semver.rcompare)
    if (typeof version === 'undefined') {
      version = '*'
    }
    version = semver.validRange(version)
    if (version == null) {
      throw new AWSUtilsError('Invalid version range.')
    }
    return wordpressBlueprints[semver.maxSatisfying(versions, version)]
  }

  async getRegion() {
    const data = await this.getRegions({
      includeAvailabilityZones: true
    })
    for (var i = 0; i < data.regions.length; i++) {
      if (data.regions[i].name === this.region) {
        return data.regions[i]
      }
    }
    throw new AWSUtilsError('Invalid region.')
  }

  async getAvailabilityZones() {
    const region = await this.getRegion()
    return region.availabilityZones
  }
}

export {Lightsail}
