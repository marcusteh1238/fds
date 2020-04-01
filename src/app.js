
require('dotenv').config({path: '.env'})

const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT;
const router = require('./router/router');

app.use(cors());
app.use('/fds', router);

app.listen(port, () => console.log(`FDS Express Backend listening on port ${port}!`));
