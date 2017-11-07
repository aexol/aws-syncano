const {getSockets, projectPath, stripNewLine} = require('./utils.js');
const {spawn} = require('child_process');
const {join, basename} = require('path');
const sockets = getSockets();
const awsUtils = "aws-utils";
const yarn = "yarn";
var linkUtils = spawn(yarn, ["link"], {cwd: join(projectPath, awsUtils)});
console.log("\nCreating aws-utils link\n")
linkUtils.stdout.on('data', (data)=>{
    console.log(`${stripNewLine(data)}`);
});
linkUtils.stderr.on('data', (data)=>{
    console.log(`${stripNewLine(data)}`);
});
linkUtils.on('close', (code) => {
    if(code != 0) {
        process.exit(code)
    }
})
for (var i = 0; i < sockets.length; i++) {
    console.log(`\nLinking aws-utils to socket ${basename(sockets[i])}\n`)
    var yarnLink = spawn(yarn, ["link", awsUtils], {cwd: sockets[i]});
    yarnLink.stdout.on('data', (data)=>{
        console.log(`${stripNewLine(data)}`);
    });
    yarnLink.stderr.on('data', (data)=>{
        console.log(`${stripNewLine(data)}`);
    });
    yarnLink.on('close', (code) => {
        if(code != 0) {
            process.exit(code)
        }
    })
}
