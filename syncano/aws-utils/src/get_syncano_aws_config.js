import Server from 'syncano-server'
import Data from 'syncano-server/Data'

// Get internal config.
async function getSyncanoAWSConfig(ctx) {
    const {socket, data, logger} = Server(ctx)
    const {error} = logger('aws-utils/get-syncano-aws-config')
}
