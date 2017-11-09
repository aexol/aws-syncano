import AWS from 'aws-bluebird'
import {awsConfig} from './aws_config'
import {AWSUtilsError} from './error'
import * as semver from 'semver'

function Lightsail(ctx, region){
    const _awsConfig = awsConfig({ctx, region})
    const ls = new AWS.Lightsail(_awsConfig)

    ls.getGroupBlueprints = async (group) => {
        const data = await this.getBlueprints()
        var blueprints = {}
        for (var i = 0; i < data.blueprints.length; i++) {
            if (data.blueprints[i].group === group) {
                blueprints[data.blueprints[i].version] = data.blueprints[i].blueprintId
            }
        }
        return blueprints
    }

    ls.getWordpressBlueprints = async () => {
        return this.getGroupBlueprints('wordpress')
    }

    ls.getWordpressBlueprintId = async (version) => {
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

    ls.getRegion = async () => {
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

    ls.getAvailabilityZones = async () => {
        const region = await this.getRegion()
        return region.availabilityZones
    }
    return ls
}

export {Lightsail}
