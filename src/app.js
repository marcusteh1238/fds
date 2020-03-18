const express = require('express');
const app = express();
const port = 3000;

const router = require('./router/router');

app.use('/fds', router);

app.listen(port, () => console.log(`FDS Express Backend listening on port ${port}!`));
