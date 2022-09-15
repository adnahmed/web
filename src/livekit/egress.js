const { EgressClient } = require('livekit-server-sdk');
const egressClient = EgressClient({host: process.env.HOST, apiKey: process.env.LIVEKIT_API_KEY, secret: process.env.LIVEKIT_SECRET_KEY });

const output = {
    protocol:  StreamProtocol.RTMP,
    urls: [`rtmp://${process.env.RTMP_HOST}/live`]
};

async function startEgress(exam, audioTrackID, videoTrackID) {
    const info = await egressClient.startTrackCompositeEgress(exam.id, output, audioTrackID, videoTrackID);
    return  info.egressId;
}

async function stopEgress(egressID) {
    await egressClient.stopEgress(egressID); // TODO: Check return value
}

module.exports = {
    startEgress,
    stopEgress
}