const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const routes = require('./src/routes');

const app = express();
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.use('/api/ssip', routes);

app.listen(8080);

module.exports = app;