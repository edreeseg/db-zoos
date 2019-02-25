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
      .json({ error: 'Request body must include a name key.' });
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

server.delete('/api/zoos/:id', (req, res) => {
  const { id } = req.params;
  db('zoos')
    .where({ id }) // See above
    .del()
    .then(deleted =>
      deleted
        ? res.json({ deleted })
        : res.status(404).json({ error: 'No zoo with that ID found.' })
    )
    .catch(err =>
      res
        .status(500)
        .json({ error: 'There was an error while attempting to delete entry.' })
    );
});

server.put('/api/zoos/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) {
    return res
      .status(400)
      .json({ error: 'Request body must include a name key.' });
  }
  db('zoos')
    .where({ id }) // See above
    .update({ name })
    .then(updated =>
      updated
        ? res.json({ updated })
        : res.status(404).json({ error: 'No zoo found with that id.' })
    )
    .catch(err =>
      res
        .status(500)
        .json({ error: 'There was an error while attempting to update entry.' })
    );
});

server.post('/api/bears', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res
      .status(400)
      .json({ error: 'Request body must include a name key.' });
  }
  db.insert({ name })
    .into('bears')
    .then(id => res.status(201).json({ id: id[0] }))
    .catch(err => res.status(500).json({ error: err }));
});

server.get('/api/bears', (req, res) => {
  db('bears')
    .then(bears => res.json({ bears }))
    .catch(err => res.status(500).json({ err }));
});

server.get('/api/bears/:id', (req, res) => {
  const { id } = req.params;
  db('bears')
    .where({ id })
    .then(bear =>
      bear.length
        ? res.json({ bear: bear[0] })
        : res.status(404).json({ error: 'No bear found with that id.' })
    )
    .catch(err =>
      res
        .status(500)
        .json({ error: 'There was an error while trying to get entry.' })
    );
});

server.delete('/api/bears/:id', (req, res) => {
  const { id } = req.params;
  db('bears')
    .where({ id })
    .del()
    .then(deleted =>
      deleted
        ? res.json({ deleted })
        : res.status(404).json({ error: 'No bear found with that id.' })
    )
    .catch(err =>
      res
        .status(500)
        .json({ error: 'There was an error while trying to delete entry.' })
    );
});

server.put('/api/bears/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name)
    return res
      .status(400)
      .json({ error: 'Request body must include a name key.' });
  db('bears')
    .where({ id })
    .update({ name })
    .then(updated =>
      updated
        ? res.json({ updated })
        : res.status(404).json({ error: 'No bear found with that id.' })
    )
    .catch(err =>
      res
        .status(500)
        .json({ error: 'There was an error while trying to update entry.' })
    );
});

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
