const {getSockets, stripNewLine, projectPath} = require('./utils')
const {spawn} = require('child_process');
const {join} = require('path');
const {copyFileSync,
    existsSync,
    mkdirSync,
    readFileSync,
    unlinkSync,
    writeFileSync} = require('fs');
const {sleep} = require('sleep');
const {exec} = require('child_process');
const {lookup, kill} = require('ps-node');
const rmdir = require('rimraf');

const registry = 'http://aaaa:aaaa@localhost:4873'
const sinopiaPidFile = join(projectPath, '.sinopia')

function startIfNotRuning(pid) {
    if(pid === -1) {
        const sinopia = spawn('npx', ['sinopia'], {detached: true, stdio: ['ignore', 'ignore', process.stdin]})
        sinopia.unref()
        sinopia.on('close', (code) => {
            if(code != 0) {
                process.exit(code)
            }
        })
        writeFileSync(sinopiaPidFile, sinopia.pid)
    }
}

function unpublish(cb) {
    var unpublish = spawn('npm', ['unpublish', '--force', `--registry=${registry}`], {cwd: 'aws-utils', stdio: ['ignore', 'ignore', 'ignore']})
    unpublish.on('close', (code, signal) => {
        cb()
    })
}

function stopIfRunning(pid) {
    if(pid !== -1) {
        npmLogin(() => unpublish(() => {
            kill(pid)
            unlinkSync(sinopiaPidFile)
        }))
    }
}

function withSinopiaPid(cb) {
    if(existsSync(sinopiaPidFile)) {
        var sinopiaPid = readFileSync(sinopiaPidFile)
        lookup({pid: sinopiaPid}, (err, resultList) => {
            if(!err) {
                var process = resultList[0]
                if(!process) {
                    sinopiaPid = -1
                }
            }
            cb(sinopiaPid)
        })
    } else {
        cb(-1)
    }
}

function startSinopia() {
    withSinopiaPid(startIfNotRuning)
}

function stopSinopia() {
    withSinopiaPid(stopIfRunning)
}

function npmLogin(cb) {
    var whoami = spawn('npm', ['whoami', `--registry=${registry}`, '--always-auth'], {stdio: ['ignore', 'ignore', 'ignore']})
    whoami.on('close', (code, signal) => {
        if(code == 0) {
            cb()
            return
        }
        var login = spawn('npm', ['login', `--registry=${registry}`, '--always-auth'], {stdio: ['pipe', process.stdout, process.stderr]})
        login.stdin.write('aaaa\naaaa\nabc@def.ghi\n')
        login.on('close', (code, signal) => {
            if(code != 0) {
                var adduser = spawn('npm', ['adduser', `--registry=${registry}`, '--always-auth'], {stdio: ['pipe', process.stdout, process.stderr]})
                adduser.stdin.write('aaaa\naaaa\nabc@def.ghi\n')
                adduser.on('close', (code, signal) => {
                    if(code != 0) {
                        process.exit(code)
                    }
                    cb()
                })
                adduser.stdin.end()
            } else {
                cb()
            }
        })
        login.stdin.end()
    })
}


function publish(cb) {
    var publish = spawn('npm', ['publish', `--registry=${registry}`], {cwd: 'aws-utils'})
    publish.on('close', (code, signal) => {
        if(code != 0) {
            process.exit(code)
        }
        cb()
    })
}

function syncUtilsInSockets() {
    const sockets = getSockets()
    for(var i = 0; i < sockets.length; i++) {
        const sockDistDir = join(sockets[i], '.dist')
        if(!existsSync(sockDistDir)) {
            mkdirSync(sockDistDir)
        }
        writeFileSync(join(sockDistDir, '.yarnrc'), `registry "${registry}"\n`)
        copyFileSync(join(sockets[i], 'package.json'), join(sockDistDir, 'package.json'))
        rmdir.sync(join(sockDistDir, 'node_modules', 'local-aws-utils'))
        var yarnProd = spawn('yarn', ['install', '--check-files', '--no-progress', '--production', `--registry=${registry}`], {cwd: sockDistDir, stdio: ['ignore', process.stdout, process.stdin]})
        yarnProd.on('close', (code, signal) => {
            if(code != 0) {
                console.log(code)
            }
        })
    }
}

module.exports.startSinopia = startSinopia
module.exports.stopSinopia = stopSinopia
module.exports.npmLogin = npmLogin
module.exports.publish = publish
module.exports.unpublish = unpublish
module.exports.syncUtilsInSockets = syncUtilsInSockets
module.exports.withSinopiaPid = withSinopiaPid
