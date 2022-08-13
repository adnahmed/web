const config = require('../config').livekit;
const { EgressClient } = require('livekit-server-sdk');
const egressClient = EgressClient({host: config.host, apiKey: config.apiKey, secret: config.secretKey});

const output = {
    protocol:  StreamProtocol.RTMP,
    urls: ['rtmp://live.twitch.tv/app/<stream-key>']
};

const info = await egressClient.startTrackCompositeEgress('my-room', output, audioTrackID, videoTrackID);
const egressID = info.egressId;

const streamEgressID = info.egressId;

info = await egressClient.updateStream(
    streamEgressID,
    ['rtmp://a.rtmp.youtube.com/live2/stream-key']
);

info = await egressClient.stopEgress(egressID);