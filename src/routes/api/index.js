const express = require('express');
const router = express.Router();

// Controllers
const healthCheck = require('@controllers/api/health-check');

router.get('/health-check', healthCheck);

module.exports = router;
