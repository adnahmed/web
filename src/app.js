const bodyParser = require('body-parser');
const morgan = require('morgan');
const express = require('express');
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

module.exports = app;

