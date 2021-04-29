const express = require('express');
const cors = require('cors');
const session = require('express-session');
const { urlencoded, json } = require('body-parser');
const swaggerUi = require('swagger-ui-express');

const routes = require('./app/routes');
const swaggerDocument = require('./app/swagger.json');

const { PORT } = process.env;

const app = express();
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));
app.use(urlencoded());
app.use(json());
app.use(cors());

app.get('/', (req, res) => {
  res.send({ status: 'OK' });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/ssip', routes);

app.listen(PORT || 8000);

module.exports = app;
