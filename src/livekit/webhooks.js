const express = require("express");
const router = express.Router();
const { WebhookReceiver } = require("livekit-server-sdk");
const receiver = new WebhookReceiver(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_SECRET_KEY);

// In order to use the validator, WebhookReceiver must have access to the raw POSTed string (instead of a parsed JSON object)
// if you are using express middleware, ensure that `express.raw` is used for the webhook endpoint
// router.use('/webhook/path', express.raw());
router.use('/', express.raw());

router.post('/', (req, res) => {
  // event is a WebhookEvent object
  const event = receiver.receive(req.body, req.get('Authorization'));
  /*
  room_started,
  room_finished,
  participant_joined,
  participant_left,
  recording_started,
  recording_finished,
  track_published,
  track_unpublished,
  egress_started,
  egress_ended
  */
});

module.exports = router;