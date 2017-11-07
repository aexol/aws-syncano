import Server from 'syncano-server';
import {defaultHash, compareHash} from 'aws-utils'

export default async (ctx) => {
    const {response, data, logger} = Server(ctx)
    const {error, debug, info} = logger('aws-config/install')
    const hashedKey = defaultHash(ctx.config.AMAZON_KEY)
    try {
        if(!compareHash(ctx.args.AMAZON_KEY, hashedKey)) {
            return response.json({message:"go away"}, 403)
        }
        if(ctx.args.AWS_ACCESS_KEY_ID.length === 0 ||
            ctx.args.AWS_SECRET_ACCESS_KEY.length === 0
        ) {
            return response.json({message:"Oops"}, 400)
        }
        var aws_id = await data.aws_id.firstOrCreate({}, {})
        await data.aws_id.update(aws_id.id, {AWS_ACCESS_KEY_ID: ctx.args.AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY: ctx.args.AWS_SECRET_ACCESS_KEY})
        var security = await data.security.firstOrCreate({}, {AMAZON_KEY: hashedKey})
        return response.json({message: "Installed"}, 200)
    } catch(e) {
        return response.json(e, 501)
    }
}
