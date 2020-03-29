
require('dotenv').config({path: '.env'})

const express = require('express');
const app = express();
const port = process.env.PORT;
const router = require('./router/router');

app.use('/fds', router);

app.listen(port, () => console.log(`FDS Express Backend listening on port ${port}!`));
