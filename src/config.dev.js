const config = {
    SECRET: 'mysecret',
    SALT_ROUNDS: 1,
    PORT: 4001,
    NEO4J: {
        PATH: '.env.dev',
    },
    REDIS: {
        USERNAME: 'default',
        PASSWORD: '',
        REDIS_HOST: 'localhost',
        REDIS_PORT: 7379,
        MAX_CONNECTION_RETRY: 10,
        RECONNECT_TIME: 3000,
    },
    LIVEKIT: {
        API_KEY: 'APItrPRpw93WoiW',
        SECRET_KEY: 'CSNYtif1ll1nvoeeqpV7mcMMKI7fQs34vSJ3BQLhUPJA',
        HOST: 'http://localhost:8880',
    },
}

module.exports = {
    ...config,
    GRAPHQL: {
        ENDPOINT: `http://localhost:${config.PORT}/graphql`,
    },
}
