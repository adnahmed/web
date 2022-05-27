const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = require('express')();

app.use(bodyParser.json()); // parse JSON body in POST request body
app.use(bodyParser.urlencoded({ extended: true })); // parse multipart-form data in POST request body 
app.use(morgan('combined'));

app.use('/login',require('./auth/login-router'));

app.listen(3001);

