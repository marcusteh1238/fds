const express = require('express');
const router = express.Router({ mergeParams: true });

// Require endpoints here
const customerRoute = require('./customer');
const restaurantstaffRoute = require('./restaurantstaff');
const fdsmanagerRoute = require('./fdsmanager');

// Endpoints here
router.use('/customer/', customerRoute);
router.use('/restaurantstaff/', restaurantstaffRoute);
router.use('/fdsmanager/', fdsmanagerRoute);

module.exports = router;
