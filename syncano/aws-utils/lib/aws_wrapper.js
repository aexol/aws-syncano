import {awsConfig} from './aws_config'
import {getRegion} from './default_region'

class AWSWrapper {
  constructor(ctx, factory) {
    Object.assign(this, ctx)
    this.__factory = factory
  }

  async init() {
    if (!this._ls) {
      const region = await getRegion(this)
      this.region = region
      const _awsConfig = await awsConfig({ctx: this, region: this.region})
      this.awsConfig = _awsConfig
      const aws = new this.__factory(this.awsConfig)
      this._aws = aws
    }
    return this._ls
  }
}
export {AWSWrapper}
