const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers');

// Child Routes
const get = require('./get');
const update = require('./update');

router.use('/get', get);
router.use('/update', update);
router.post('/create', ctrl.collection.create);
router.delete('/delete', ctrl.collection.delete);

module.exports = router;
