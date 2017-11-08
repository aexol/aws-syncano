const {startSinopia, npmLogin, publish} = require('./local_repo')
const {sleep} = require('sleep');

startSinopia()
sleep(5)
npmLogin(publish)
