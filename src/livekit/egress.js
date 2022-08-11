const config = require('../config').livekit;
const { EgressClient } = require('livekit-server-sdk');
const egressClient = EgressClient({host: config.host, apiKey: config.apiKey, secret: config.secretKey});