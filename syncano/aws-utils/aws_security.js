import Server from 'syncano-server'
import {compareHash} from './utils.js'

async function isAdmin(ctx) {
    const {data} = Server(ctx)
    var security
    try {
        security = await data.security.firstOrFail()
    } catch(e) {
        throw {message: "Please install and configure aws-config socket."}
    }
    return compareHash(ctx.args.AMAZON_KEY, security.AMAZON_KEY)
}

export {
    isAdmin
}
