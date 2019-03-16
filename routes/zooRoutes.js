const express = require('express');
const router = express.Router();
const knex = require('knex');
const knexConfig = require('../knexfile');
const db = knex(knexConfig.development);

router.post('/', (req, res) => {
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

router.get('/', (req, res) => {
  db('zoos')
    .then(zoos => res.json({ zoos }))
    .catch(err =>
      res
        .status(500)
        .json({ error: 'There was an error while attempting to get zoos.' })
    );
});

router.get('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
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

router.put('/:id', (req, res) => {
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

module.exports = router;
