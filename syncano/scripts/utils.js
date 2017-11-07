const {lstatSync, existsSync, readdirSync} = require('fs')
const {join, dirname} = require('path')
const projectPath = dirname(__dirname)

module.exports.projectPath = projectPath
module.exports.getSockets = () => {
    const isDirectory = path => lstatSync(path).isDirectory()
    const isProjectPath = projectPath => isDirectory(projectPath) && existsSync(join(projectPath, "syncano.yml"))
    const isSocket = path => isDirectory(path) && existsSync(join(path, "socket.yml"))
    if(!isProjectPath(projectPath)) {
        throw "Not a valid syncano project path."
    }
    getDirectories = projectPath => readdirSync(projectPath).map(name => join(projectPath, name)).filter(isSocket)
    return getDirectories(projectPath)
}
module.exports.stripNewLine = (data) => {
    data=`${data}`
    return data.replace(/(\r|\n)$/g,"")
}
