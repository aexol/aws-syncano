import server from 'syncano-server'
import Data from './api_key_data'

// Monkey patch syncano functions.

export default (ctx = {}) => {
  const Server = server(ctx)
  server.data = Data(server.config)
  return Server
}
