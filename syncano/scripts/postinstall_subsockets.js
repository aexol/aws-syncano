const {getSockets, stripNewLine} = require('./utils.js')
const {spawn} = require('child_process')
const {basename} = require('path');
const sockets = getSockets()
const yarn = "yarn"
for (var i = 0; i < sockets.length; i++) {
    console.log(`\nInstalling ${basename(sockets[i])}\n`)
    yarnPr = spawn(yarn, [], {cwd: sockets[i]})
    yarnPr.stdout.on('data', (data)=>{
        console.log(`${stripNewLine(data)}`);
    });
    yarnPr.stderr.on('data', (data)=>{
        console.log(`${stripNewLine(data)}`);
    });
    yarnPr.on('close', (code) => {
        if(code != 0) {
            process.exit(code)
        }
    })
}
