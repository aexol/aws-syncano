import _Data from 'syncano-server/Data'

// Monkey patch request to include admin-token with internal aws admin user.
// Only for use inside library
export default class Data extends _Data {
  //constructor(users, ctx) {
  //  super(ctx)
  //  this.admin = users.where('username', '_internal_aws_admin').firstOrFail()
  //}

  //async fetch(url, options, headers = {}) {
  //  const headersToSend = Object.assign(
  //    {
  //      _user_key: (await this.admin).user_key
  //    },
  //    headers
  //  )
  //  return super.fetch(url, options, headersToSend)
  //}
}
