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
const EventEmitter = require('events')

const registry = 'http://aaaa:aaaa@localhost:4873'
const sinopiaPidFile = join(projectPath, '.sinopia')

function startIfNotRuning(pid) {
    if(pid === -1) {
        const sinopia = spawn('npx', ['sinopia'], {detached: true, stdio: ['ignore', 'ignore', 'ignore']})
        sinopia.unref()
        sinopia.on('close', (code) => {
            if(code != 0) {
                console.log(`Sinopia exited with ${code}`)
                process.exit(code)
            }
        })
        writeFileSync(sinopiaPidFile, sinopia.pid)
    }
}

function unpublish(cb) {
    var unpublish = spawn('npm', ['unpublish', '--force', `--registry=${registry}`], {cwd: 'aws-utils', stdio: ['ignore', 'ignore', 'ignore']})
    unpublish.on('close', (code, signal) => {
        if(code != 0) {
            console.log(`npm unpublish exited with ${code}`)
        }
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
                        console.log(`npm adduser exited with ${code}`)
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


function publish(opts, cb) {
    if(cb === "undefined") {
        if(typeof opts === "function") {
            cb = opts
        } else {
            throw new Error("Callback required.")
        }
    }

    pubFunc = () => {
        var publish = spawn('npm', ['publish', `--registry=${registry}`], {cwd: 'aws-utils'})
        publish.on('close', (code, signal) => {
            if(code != 0) {
                console.log(`npm publish exited with ${code}`)
                process.exit(code)
            }
            cb()
        })
    }
    if(opts.bumpVersion === "undefined" || opts.bumpVersion === true) {
        var bumpPatch = spawn('npm', ['version', 'patch'], {cwd: 'aws-utils'})
        bumpPatch.on('close', (code, signal) => {
            if(code == 0) {
                pubFunc()
            }
        })
    } else {
        pubFunc()
    }
}

class InstallSync extends EventEmitter{}

function syncUtilsInSockets() {
    const sockets = getSockets()
    const installEvents = new InstallSync()
    var lInstall = 0
    for(var i = 0; i < sockets.length; i++) {
        const sockDistDir = join(sockets[i], '.dist')
        if(!existsSync(sockDistDir)) {
            mkdirSync(sockDistDir)
        }
        writeFileSync(join(sockDistDir, '.yarnrc'), `registry "${registry}"\n`)
        //copyFileSync(join(sockets[i], 'package.json'), join(sockDistDir, 'package.json'))
        rmdir.sync(join(sockDistDir, 'node_modules', 'local-aws-utils'))
        const installIfNeeded = () => {
            const f = () => {
                if(lInstall !== 0) {
                    return
                }
                lInstall = 1
                const yarnInst = spawn('yarn', ['install', `--registry=${registry}`], {cwd: sockets[i], stdio: ['ignore', 'ignore', process.stderr]})
                yarnInst.on('close', (code, signal) => {
                    if(code != 0) {
                        console.log(`yarn install exited with: ${code}`)
                    }
                    lInstall = 0
                    installEvents.emit('install')
                })
                installEvents.removeListener('install', f)
            }
            installEvents.on('install', f)
            installEvents.emit('install')
        }
        if(!existsSync(join(sockets[i], 'yarn.lock'))) {
            installIfNeeded()
        } else {
            const yarnProd = spawn('yarn', ['upgrade', '--prefer-offline', '-L', 'local-aws-utils', `--registry=${registry}`], {cwd: sockets[i], stdio: ['ignore', 'ignore', process.stderr]})
            yarnProd.on('close', (code, signal) => {
                if(code != 0) {
                    installIfNeeded()
                }
            })
        }
    }
}

module.exports.startSinopia = startSinopia
module.exports.stopSinopia = stopSinopia
module.exports.npmLogin = npmLogin
module.exports.publish = publish
module.exports.unpublish = unpublish
module.exports.syncUtilsInSockets = syncUtilsInSockets
module.exports.withSinopiaPid = withSinopiaPid
