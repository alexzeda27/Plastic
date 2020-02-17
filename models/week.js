'use strict'

//Librerias
var mongoose = require('mongoose');

//Esquema del modelo
var Schema = mongoose.Schema;

//Modelo de Semana
var WeekSchema = Schema({

    week: String
});

//Exportar modelo
module.exports = mongoose.model('Week', WeekSchema);