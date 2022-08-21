const bodyParser = require('body-parser');
const morgan = require('morgan');
const express = require('express');
require('dotenv').config()
const app = express();

app.use(bodyParser.json()); // parse JSON body in POST request body
app.use(bodyParser.urlencoded({ extended: true })); // parse multipart-form data in POST request body 
app.use(morgan('combined'));

/* Start GraphQL Server */
(async () => {
    const apolloServer = await require('./graphql/server');
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });
})();

/* Setup Initial DB */
(async ()  => {
    const setupDB = await require("./db/startup-setup");
    await setupDB();
})();

app.use('/exam', require('./files/exam'));
app.use('/lk_webhooks', require('./livekit/webhooks'));
module.exports = app;

