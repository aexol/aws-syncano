const {npmLogin, publish, syncUtilsInSockets} = require('./local_repo')
const {sleep} = require('sleep');

var pub = () => {
    publish({bumpVersion: false} ,() => {})
}
npmLogin(pub)
