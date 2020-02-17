'use strict'

//Librerias
var mongoose = require('mongoose');

//Esquema del modelo
var Schema = mongoose.Schema;

//Modelo de Fecha Movilidad
var mobilityDateSchema = Schema({

    month: { type: Schema.ObjectId, ref: 'Month' },
    week: { type: Schema.ObjectId, ref: 'Week' }, 
    day: { type: Schema.ObjectId, ref: 'Day' }
});

//Exportar modelo
module.exports = mongoose.model('MobilityDate', mobilityDateSchema);