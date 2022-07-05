const bodyParser = require('body-parser');
const morgan = require('morgan');
const express = require('express');
const app = express();
app.use(bodyParser.json()); // parse JSON body in POST request body
app.use(bodyParser.urlencoded({ extended: true })); // parse multipart-form data in POST request body 
app.use(morgan('combined'));

// Convert response from neo4j types to native types
app.use(require('./middleware/neo4j-type-handler'))

(async () => {
    const apolloServer = await require('./graphql/server');
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });
})();

// Handle any constraint errors thrown by Neo4j
app.use(require('./middleware/neo4j-error-handler'))

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


module.exports = app;

