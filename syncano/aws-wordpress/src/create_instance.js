import Server from 'syncano-server';
//import * as awsUtils from 'aws-utils';

//function makeid() {
//  var text = "";
//  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//
//  for (var i = 0; i < 5; i++)
//    text += possible.charAt(Math.floor(Math.random() * possible.length));
//
//  return text;
//}

export default async ctx => {
    const {data, response, logger} = new Server(ctx)
    //const {debug, error, warn, info} = logger('aws-wordpress@create_instance:')
    //error("Abc")
    //error("Def")
    //if(!ctx.meta.user) {
    //    response.json({reason: "Well well."}, 401)
    //    process.exit(0)
    //}
    //error("Ghi")
    //var {newLightsailInstance} = ctx.instance+"-"+makeid()
    //response.json(data.lightsail_instances.firstOrCreate())
    return response.json({foo: "foo"})//awsUtils.foo())
}