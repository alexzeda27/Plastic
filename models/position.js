'use strict'

//Cargamos la libreria de mongoose
var mongoose = require('mongoose');
//Creamos el esquema para el modelo Position
var Schema = mongoose.Schema;

//El esquema de positions tendra los siguientes atributos
var PositionSchema = Schema({

    positionName: String,
    typeWorker: { type: Schema.ObjectId, ref: 'TypeWorker' },
    costCenter: { type: Schema.ObjectId, ref: 'CostCenter' }
});

//Exportamos el modelo para usarlo en otros archivos
module.exports = mongoose.model('Position', PositionSchema);