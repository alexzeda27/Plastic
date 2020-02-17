'use strict'

//Librerias
var mongoose = require('mongoose');

//Esquema del modelo
var Schema = mongoose.Schema;

//Modelo de Mes
var MonthSchema = Schema({

    month: String
});

//Exportar modelo
module.exports = mongoose.model('Month', MonthSchema);