const express = require('express');
const cors = require('cors');
const session = require('express-session');
const { urlencoded, json } = require('body-parser');

const routes = require('./app/routes');

const { PORT } = process.env;

const app = express();
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(urlencoded());
app.use(json());
app.use(cors());

app.use('/api/ssip', routes);

app.listen(PORT || 8000);

module.exports = app;