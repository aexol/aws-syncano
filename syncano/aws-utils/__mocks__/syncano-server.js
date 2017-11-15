//__mocks__/syncano-server.js
'use strict'
const Server = jest.genMockFromModule('syncano-server');

let firstId = Object.create(null);
function __setFirstId (newFirstId) {
    firstId = newFirstId;
}

let data = Object.create(null)

async function firstOrFail() {
    if(!firstId) {
        throw new Error("first id not set");
    }
    return firstId;
}

function where() {
    return this
}

function __setDataClasses(newDataClasses) {
    data = Object.create(null)
    for(let i in newDataClasses) {
        const klazz = newDataClasses[i]
        if(!data) {
            data = {};
        }
        data[klazz] = {};
        data[klazz].firstOrFail = firstOrFail;
        data[klazz].where = where;
    }
}

function logger(tag) {
    const logger = {};
    logger.tag = tag;
    const format = (msg, lvl) => `${tag}-${lvl}: ${msg}`;
    logger.error = (msg) => format(msg, 'error');
    logger.debug = (msg) => format(msg, 'debug');
    logger.warn = (msg) => format(msg, 'warn');
    logger.info = (msg) => format(msg, 'info');
    return logger;
}

module.exports = (ctx) => {
    Server.logger = logger;
    Server.data = data;
    Server.__setDataClasses = __setDataClasses;
    Server.__setFirstId = __setFirstId;
    return Server
};
