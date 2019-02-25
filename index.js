const express = require('express');
const helmet = require('helmet');

const server = express();

const knex = require('knex');
const knexConfig = require('./knexfile');
const db = knex(knexConfig.development);

server.use(express.json());
server.use(helmet());

// endpoints here

server.post('/api/zoos', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res
      .status(400)
      .json({ error: 'Request must include a name key in the body.' });
  }
  db.insert({ name })
    .into('zoos')
    .then(id => res.status(201).json({ id: id[0] }))
    .catch(err =>
      res
        .status(500)
        .json({ error: 'There was an error while attempting to add entry.' })
    );
});

server.get('/api/zoos', (req, res) => {
  db('zoos')
    .then(zoos => res.json({ zoos }))
    .catch(err =>
      res
        .status(500)
        .json({ error: 'There was an error while attempting to get zoos.' })
    );
});

server.get('/api/zoos/:id', (req, res) => {
  const { id } = req.params;
  db('zoos')
    .where({ id }) // Can also do ('id', '=', id) or ({ id: id })
    .then(zoo =>
      zoo.length
        ? res.json({ zoo: zoo[0] })
        : res.status(404).json({ error: 'No zoo with that ID found.' })
    )
    .catch(err =>
      req
        .status(500)
        .json({ error: 'There was an error while attempting to get zoo.' })
    );
});

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
