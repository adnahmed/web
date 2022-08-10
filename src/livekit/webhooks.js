const app = require('../app');
const config = require('../config').livekit;
const { WebhookReceiver } = require("livekit-server-sdk");
const receiver = new WebhookReceiver(config.apiKey, config.secretKey);

// In order to use the validator, WebhookReceiver must have access to the raw POSTed string (instead of a parsed JSON object)
// if you are using express middleware, ensure that `express.raw` is used for the webhook endpoint
// router.use('/webhook/path', express.raw());

app.post('/webhook-endpoint', (req, res) => {
  // event is a WebhookEvent object
  const event = receiver.receive(req.body, req.get('Authorization'));
});