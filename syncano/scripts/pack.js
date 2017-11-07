const {existsSync} = require('fs')
const {join, basename} = require('path')
const {getSockets, projectPath, stripNewLine} = require('./utils.js');
const {spawn} = require('child_process');

const sockets = (function () {
    const needsPacking = path => existsSync(join(path, "webpack.config.js"))
    return getSockets().map(name => name).filter(needsPacking)
}());

for(var i = 0; i < sockets.length; i++) {
    console.log(`\nGenerating packed sources for ${basename(sockets[i])}`);
    var webpack = spawn("../node_modules/.bin/webpack", ["--config", "webpack.config.js"], {cwd: sockets[i]});
    webpack.stdout.on('data', (data)=>{
        console.log(`${stripNewLine(data)}`);
    });
    webpack.stderr.on('data', (data)=>{
        console.log(`${stripNewLine(data)}`);
    });
    webpack.on('close', (code) => {
        if(code != 0) {
            process.exit(code);
        }
    })
}
