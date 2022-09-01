const config = {
    secret: 'mysecret',
    saltRounds: 1,
    port: 4001,
    neo4j: {
        path: '.env.dev',
    },
    redis: {
        username: 'default',
        password: '',
        REDIS_HOST: 'localhost',
        REDIS_PORT: 7379,
        MAX_CONNECTION_RETRY: 10,
        RECONNECT_TIME: 3000,
    },
    livekit: {
        apiKey: 'APItrPRpw93WoiW',
        secretKey: 'CSNYtif1ll1nvoeeqpV7mcMMKI7fQs34vSJ3BQLhUPJA',
        host: 'http://localhost:8880',
    },
}

module.exports = {
    ...config,
    graphql: {
        endpoint: `http://localhost:${config.port}/graphql`,
    },
}
