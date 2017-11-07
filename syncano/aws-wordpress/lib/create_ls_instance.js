import Server from 'syncano-server';
import {awsConfig, isAdmin, makeid} from 'aws-utils';

export default async (ctx) => {
    const {response, logger} = Server(ctx)
    if(!(await isAdmin(ctx))) {
        return response.json({message:"Forbidden"}, 403)
    }
    const {debug, error, warn, info} = logger('aws-wordpress@create_instance:')
    var newLightsailInstance = ctx.meta.instance+"-"+makeid(5)
    return response.json(awsConfig({ctx: ctx, region: "eu-central-1"}), 200)
}
