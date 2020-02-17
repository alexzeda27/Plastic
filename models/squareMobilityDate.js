'use strict'

//Librerias
var mongoose = require('mongoose');

//Esquema del modelo
var Schema = mongoose.Schema;

//Modelo de bloque de fecha de movilidad
var squareMobilityDate = Schema({

    departmentMobility: { type: Schema.ObjectId, ref: 'DepartmentMobilities' },
    square : { type: Schema.ObjectId, ref: 'Square' }
});

//Exportar modelo
module.exports = mongoose.model('SquareMobilities', squareMobilityDate);