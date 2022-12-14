const bodyParser = require('body-parser');
const morgan = require('morgan');
const express = require('express');
const app = express();

app.use(bodyParser.json()); // parse JSON body in POST request body
app.use(bodyParser.urlencoded({ extended: true })); // parse multipart-form data in POST request body 
app.use(morgan('combined'));

app.use('/exam', require('./files/exam'));
app.use('/lk_webhooks', require('./livekit/webhooks'));
module.exports = app;

