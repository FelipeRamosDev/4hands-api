const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers');

router.get('/queryCollection', ctrl.collection.get.queryCollection);
router.get('/doc', ctrl.collection.get.doc);

module.exports = router;
