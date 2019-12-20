'use strict'

//Cargamos la libreria de Mongoose
var mongoose = require('mongoose');
//Cargamos el archivo de app
var app = require('./app');
//Reservamos el puerto 3999
var port = 3900;

//Promesa a la base de datos
mongoose.Promise = global.Promise;

//Conexión a la base de datos en el puerto 27017
mongoose.connect('mongodb://localhost:27017/plastic', { useUnifiedTopology: true, useNewUrlParser: true })
        //Si no existe algún error
        .then(() => {
            console.log('Se ha conectado a la base de datos de manera exitosa');

            //Conectamos nuestro servidor al puerto indicado
            app.listen(port, () => {
                console.log('Servidor creado correctamente')
            });
        })
        //Capturamos el error y lo mostramos por consola
        .catch(err => console.log(err));