const express = require('express');
const app = express();
require('../config/config');

app.use(require('./usuario'));
app.use(require('./login'));


module.exports = app;