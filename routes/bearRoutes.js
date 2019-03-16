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
    .into('bears')
    .then(id => res.status(201).json({ id: id[0] }))
    .catch(err => res.status(500).json({ error: err }));
});

router.get('/', (req, res) => {
  db('bears')
    .then(bears => res.json({ bears }))
    .catch(err => res.status(500).json({ err }));
});

router.get('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
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

router.put('/:id', (req, res) => {
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

module.exports = router;
