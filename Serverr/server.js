require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//RUTAS
app.use(require('./Rutas/index'));


mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true },
    (err, res) => {
        if (err) {
            throw Error(err);
        } else {
            console.log('Base de datos ONLINE');
        }
    });

app.listen(process.env.PORT, () => {
    console.log(`escuchando el puerto ${process.env.PORT}`);
});