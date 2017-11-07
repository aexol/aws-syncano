import AWS from 'aws-sdk'
import {awsConfig} from './config'
import * as semver from 'semver'

var lightsailClass = class {
    constructor(ctx, region) {
        this.ctx = ctx
        this.region = region
        this.awsConfig = awsConfig({ctx, region});
        this.ls = new AWS.Lightsail(this.awsConfig);
    }

    async getBlueprints() {
        return new Promise((resolve, reject) => {
            return this.ls.getBlueprints({includeInactive: true}, (err, data) => {
                    return err ? reject(err) : resolve(data);
            })
        })
    }

    async getGroupBlueprints(group) {
        const data = await this.getBlueprints();
        var blueprints = {};
        for (var i = 0; i < data.blueprints.length; i++) {
            if(data.blueprints[i].group === group) {
                blueprints[data.blueprints[i].version] = data.blueprints[i].blueprintId;
            }
        }
        return blueprints;
    }

    async getWordpressBlueprints() {
        return await this.getGroupBlueprints("wordpress");
    }

    async getWordpressBlueprintId(version) {
        const wordpressBlueprints = await this.getWordpressBlueprints();
        const versions = Object.keys(wordpressBlueprints).sort(semver.rcompare);
        if(typeof version === "undefined") {
            version = "*";
        }
        version = semver.validRange(version);
        if(version == null) {
            throw "Invalid version range.";
        }
        return wordpressBlueprints[semver.maxSatisfying(versions, version)];
    }

    async getRegions() {
        const params = {
          includeAvailabilityZones: true
        };
        return new Promise((resolve, reject) => {
            return this.ls.getRegions(params, (err, data) => {
                return err ? reject(err) : resolve(data);
            })
        })
    }

    async getRegion() {
        const data = await this.getRegions()
        for (var i = 0; i < data.regions.length; i++) {
            if(data.regions[i].name === this.region) {
                return data.regions[i];
            }
        }
        throw "Invalid region."
    }

    async getAvailabilityZones() {
        const region = await this.getRegion();
        return region.availabilityZones;
    }
}

function Lightsail(config, region) {
    return new lightsailClass(config, region);
}

export {Lightsail};
