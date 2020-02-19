'use strict'

//Librerias
var mongoose = require('mongoose');

//Esquema del modelo
var Schema = mongoose.Schema;

//Modelo de Día
var DaySchema = Schema({

    dia: String
});

//Exportar modelo
module.exports = mongoose.model('Day', DaySchema);