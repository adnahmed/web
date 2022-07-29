const bodyParser = require('body-parser');
const morgan = require('morgan');
const express = require('express');
const app = express();
const rateLimiterRedis = require('./middleware/rateLimiterRedis');

app.use(bodyParser.json()); // parse JSON body in POST request body
app.use(bodyParser.urlencoded({ extended: true })); // parse multipart-form data in POST request body 
app.use(morgan('combined'));
app.use(rateLimiterRedis);

(async () => {
    const apolloServer = await require('./graphql/server');
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });
})();

module.exports = app;

