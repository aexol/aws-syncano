import Server from 'syncano-server'
import lightsail from './lightsail'
export default async (ctx, name) => {
    let lightsailInstanceName = `${ctx.meta.instance}-lightsail-${name}`
    var params = {
      availabilityZone: 'STRING_VALUE', /* required */
      blueprintId: 'STRING_VALUE', /* required */
      bundleId: 'STRING_VALUE', /* required */
      instanceNames: [ /* required */
        'STRING_VALUE',
      ],
      customImageName: 'STRING_VALUE',
      keyPairName: 'STRING_VALUE',
      userData: 'STRING_VALUE'
    };
    lightsail.createInstances(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else     console.log(data);           // successful response
    });
}