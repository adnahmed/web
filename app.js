const bodyParser = require('body-parser');
const morgan = require('morgan');
//const loginRouter = require('./auth/login');
const express = require('express');
const app = express();
const login = require('./auth/login');
const register = require("./auth/register");
const unregister = require('./auth/unregister');
app.use(bodyParser.json()); // parse JSON body in POST request body
app.use(bodyParser.urlencoded({ extended: true })); // parse multipart-form data in POST request body 
app.use(morgan('combined'));

app.use("/login", login);
app.use("/register", register);
app.use("/unregister", unregister);
module.exports = app;

