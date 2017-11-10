import {profile, user} from './fakedata'
import Server from 'syncano-server'
const {data, users} = Server({
  meta: {
    token: process.env.ACCOUNT_KEY,
    instance: process.env.SYNCANO_INSTANCE_NAME
  }
})

export const createUser = (args = {}) => users.create(user(args))
