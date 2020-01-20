'use strict'

//Cargamos la libreria de mongoose
var mongoose = require('mongoose');

//Creamos el esquema de registro
var Schema = mongoose.Schema;

//El esquema de registro tendra los siguientes atributos
var RegisterSchema = Schema({

    month: String,
    week: String,
    day: String
});

//Exportamos el modelo
module.exports = mongoose.model('Register', RegisterSchema);