const {startSinopia, npmLogin, publish, syncUtilsInSockets} = require('./local_repo')
const {sleep} = require('sleep');

startSinopia()
var pub = () => {
    publish(() => {
        syncUtilsInSockets()
    })
}
npmLogin(pub)
