const { RoomServiceClient } = require('livekit-server-sdk');
const svc = new RoomServiceClient(process.env.HOST, process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_SECRET_KEY);

async function createExamRoom(exam) {
// list rooms
const rooms = await svc.listRooms()
  if(checkExists(rooms, exam.id))
      throw new Error('Exam Room already exists.')
 // create a new room
  await svc.createRoom({
    name: exam.id,
    // timeout in seconds
    emptyTimeout: 10 * 60,
    maxParticipants: exam.numExaminees, // query db for examinees
  });

  // delete room
  setTimeout(() => {
    svc.deleteRoom(exam.id)
  }, (exam.duration + exam.relaxDuration));

}

function checkExists(rooms, room) {
  rooms.forEach(room => {
      if(room.name === room) 
        return true
  });
  return false;
}

module.exports = createExamRoom