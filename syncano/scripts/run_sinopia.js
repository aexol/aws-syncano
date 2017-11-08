const {startSinopia, stopSinopia, npmLogin, publish} = require('./local_repo')
const {sleep} = require('sleep');

process.stdin.resume()

startSinopia()
sleep(5)
npmLogin(publish)
process.on('SIGTERM', () => {
    stopSinopia()
})
process.on('SIGINT', () => {
    stopSinopia()
})
