var fs = require('fs');
var sh = require('shelljs');

var pJsons = process.argv.slice(2);
var packageJson = require(`${sh.pwd()}/package.json`);
for (const i in pJsons) {
  packageJson.dependencies = Object.assign(
    packageJson.dependencies,
    require('./' + pJsons[i]).dependencies
  );
}

fs.writeFileSync('./package.json', JSON.stringify(packageJson, 0, 2));
