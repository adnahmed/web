const config = require('../config').livekit;

const livekitApi = require('livekit-server-sdk');
const AccessToken = livekitApi.AccessToken;
const RoomServiceClient = livekitApi.RoomServiceClient;


// if this room doesn't exist, it'll be automatically created when the first
// client joins
const roomName = 'name-of-room';
// identifier to be used for participant.
// it's available as LocalParticipant.identity with livekit-client SDK
const participantName = 'user-name';

const accessToken = new AccessToken(config.apiKey, config.secretKey, {
  identity: participantName,
  ttl: '2h' // Exam Time
});

accessToken.addGrant({  
    /** permission to create a room */
    roomCreate: false,
    /** permission to join a room as a participant, room must be set */
    roomJoin: false,
    /** permission to list rooms */
    roomList: false,
    /** permission to start a recording */
    roomRecord: true,
    /** permission to control a specific room, room must be set */
    roomAdmin: false,
    /** name of the room, must be set for admin or join permissions */
    room: "",
    /**
     * allow participant to publish. If neither canPublish or canSubscribe is set,
     * both publish and subscribe are enabled
     */
    canPublish: true,
    /** allow participant to subscribe to other tracks */
    canSubscribe: true,
    /**
     * allow participants to publish data, defaults to true if not set
     */
    canPublishData: false,
    /** participant isn't visible to others */
    hidden: true,
    /** participant is recording the room, when set, allows room to indicate it's being recorded */
    recorder: false
});

const token = accessToken.toJwt();
console.log('access token', token);

