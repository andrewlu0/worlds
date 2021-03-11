const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const next = require('next');
const pathMatch = require('path-match');
const app = next({ dev });
const handle = app.getRequestHandler();
const { parse } = require('url');

const apiRoutes = require('./server/routes/apiRoutes.js');

app.prepare().then(() => {
  const server = express();

  server.use('/api', apiRoutes);

  server.get('/graph', (req, res) => {
    return app.render(req, res, '/graph');
  });

  server.get('/world', (req, res) => {
    return app.render(req, res, '/world');
  });

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 3000;
  /* eslint-disable no-console */
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Server ready on http://localhost:${PORT}`);
  });
});