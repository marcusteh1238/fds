const express = require('express');
const router = express.Router({ mergeParams: true });

// Require endpoints here
const customerRoute = require('./customer');

// Endpoints here
router.use('/customer/', customerRoute);

module.exports = router;
