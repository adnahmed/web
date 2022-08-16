const config = require('../config').livekit;
const { RoomServiceClient, Room } = require('livekit-server-sdk');
const livekitHost = config.host;
const svc = new RoomServiceClient(livekitHost, config.apiKey, config.secretKey);

// list rooms
svc.listRooms().then((rooms) => {
  console.log('existing rooms', rooms);
});

// create a new room
const opts = {
  name: 'myroom',
  // timeout in seconds
  emptyTimeout: 10 * 60,
  maxParticipants: 20,
};

svc.createRoom(opts).then((room) => {
  console.log('room created', room);
});

// delete a room
svc.deleteRoom('myroom').then(() => {
  console.log('room deleted');
});