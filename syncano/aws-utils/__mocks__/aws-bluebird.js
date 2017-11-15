//__mocks__/aws-bluebird.js
'use strict'
const AWS = jest.genMockFromModule('aws-bluebird');

function Credentials(params) {
    return params
}

function Config(params) {
    return params
}

let blueprints = Object.create(null)

function __setBlueprints(newBlueprints) {
    blueprints = Object.create(null)
    for(let i in newBlueprints) {
        let blueprint = newBlueprints[i]
        if(!blueprints['blueprints']) {
            blueprints = {
                blueprints: []
            }
        }
        blueprints.blueprints.push(blueprint)
    }
}

let regions = Object.create(null)
function __setRegions(newRegions) {
    regions = Object.create(null)
    for(let i in newRegions) {
        let region = newRegions[i]
        if(!regions['regions']) {
            regions = {
                regions: []
            }
        }
        regions.regions.push(region)
    }
}

let bundles = Object.create(null)
function __setBundles(newBundles) {
    bundles = Object.create(null)
    for(let i in newBundles) {
        let bundle = newBundles[i]
        if(!bundles['bundles']) {
            bundles = {
                bundles: []
            }
        }
        bundles.bundles.push(bundle)
    }
}

class Lightsail {
    constructor(params) {
        Object.assign(this, params)
    }

    async getBlueprints() {
        return blueprints
    }

    async getRegions() {
        return regions
    }

    async getBundles() {
        return bundles 
    }

    async createKeyPair(opts) {
        return {
            name: opts.keyPairName,
            publicKeyBase64: 'PUBSSH',
            privateKeyBase64: 'PRIVSSH',
            keyPair: {
                location: {
                    regionName: 'regg'
                }
            }
        }
    }

    async createInstances(params) {
        return true
    }
}


AWS.Credentials = Credentials
AWS.Config = Config
AWS.Lightsail = Lightsail
AWS.__setBlueprints = __setBlueprints
AWS.__setRegions = __setRegions
AWS.__setBundles = __setBundles

module.exports = AWS
