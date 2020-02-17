'use strict'

//Librerias
var mongoose = require('mongoose');

//Esquema del modelo
var Schema = mongoose.Schema;

//Modelo de Departamento de fecha de movilidad
var departmentMobilityDateSchema = Schema({

    mobilityDate: { type: Schema.ObjectId, ref: 'MobilityDate' },
    department : { type: Schema.ObjectId, ref: 'Department' }
});

//Exportar modelo
module.exports = mongoose.model('DepartmentMobilities', departmentMobilityDateSchema);