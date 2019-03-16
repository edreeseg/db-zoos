const express = require('express');
const helmet = require('helmet');

const server = express();

const knex = require('knex');
const knexConfig = require('./knexfile');
const db = knex(knexConfig.development);

server.use(express.json());
server.use(helmet());
const zooRoutes = require('./routes/zooRoutes');
const bearRoutes = require('./routes/bearRoutes');

// endpoints here

server.use('/api/zoos', zooRoutes);
server.use('/api/bears', bearRoutes);

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
