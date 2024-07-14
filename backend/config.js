const dotenv = require('dotenv')
const ENV_DIR = './'

function loadConfig(isLocalMode) {
    dotenv.config({
        path: ENV_DIR + '.env' + (isLocalMode ? '.local' : ''),
        override: false
    })

    process.env.ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS.split(' ')
}

module.exports.loadConfig = loadConfig