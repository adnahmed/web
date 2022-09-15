const livekitApi = require('livekit-server-sdk')
const AccessToken = livekitApi.AccessToken

function createAccessToken(user, exam) {
    const accessToken = new AccessToken(
        process.env.LIVEKIT_API_KEY,
        process.env.LIVEKIT_SECRET_KEY,
        {
            identity: user.id,
            ttl: exam.duration,
        }
    )
    const isProctorOrAdministrator =
        user.role == 'proctor' || user.role == 'administrator'
    accessToken.addGrant({
        /** permission to create a room */
        roomCreate: isProctorOrAdministrator,
        /** permission to join a room as a participant, room must be set */
        roomJoin: true,
        /** permission to list rooms */
        roomList: isProctorOrAdministrator,
        /** permission to start a recording */
        roomRecord: isProctorOrAdministrator,
        /** permission to control a specific room, room must be set */
        roomAdmin: isProctorOrAdministrator,
        /** name of the room, must be set for admin or join permissions */
        room: exam.id,
        /**
         * allow participant to publish. If neither canPublish or canSubscribe is set,
         * both publish and subscribe are enabled
         */
        canPublish: true,
        /** allow participant to subscribe to other tracks */
        canSubscribe: isProctorOrAdministrator,
        /**
         * allow participants to publish data, defaults to true if not set
         */
        canPublishData: isProctorOrAdministrator,
        /** participant isn't visible to others */
        hidden: !isProctorOrAdministrator,
        /** participant is recording the room, when set, allows room to indicate it's being recorded */
        recorder: !isProctorOrAdministrator,
    })
    return accessToken.toJwt()
}

module.exports = createAccessToken