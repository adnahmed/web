const path = require('path')
const configPath = path.resolve(__dirname + '/..' )
                 + "/" 
                 + ((process.env.NODE_ENV || "debug") == "debug" ? ".env.dev" : ".env.prod" )
require('dotenv').config({ path: configPath })
// Default Dev Configuration
process.env.HOST = process.env.HOST || 'localhost'
process.env.SECRET = process.env.SECRET || 'mysecret'
process.env.SALT_ROUNDS = process.env.SALT_ROUNDS || 1
process.env.PORT = process.env.PORT || 3000
process.env.NEO4J_PATH = process.env.NEO4J_PATH || '.neode.env.dev'
process.env.REDIS_USERNAME = process.env.REDIS_USERNAME || 'default'
process.env.REDIS_PASSWORD = process.env.REDIS_PASSWORD || ''
process.env.REDIS_HOST = process.env.REDIS_HOST || 'localhost'
process.env.REDIS_PORT = process.env.REDIS_PORT || 6379
process.env.REDIS_MAX_CONNECTION_RETRY = process.env.REDIS_MAX_CONNECTION_RETRY || 1
process.env.REDIS_RECONNECT_TIME = process.env.REDIS_RECONNECT_TIME || 3000
// process.env.REDIS_TLS_CA
process.env.LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY || 'APItrPRpw93WoiW'
process.env.LIVEKIT_SECRET_KEY = process.env.LIVEKIT_SECRET_KEY || 'CSNYtif1ll1nvoeeqpV7mcMMKI7fQs34vSJ3BQLhUPJA'
process.env.LIVEKIT_HOST = process.env.LIVEKIT_HOST || 'ws://localhost:7880'