const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers');

router.put('/document', ctrl.collection.update.document);

module.exports = router;
