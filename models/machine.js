'use strict'

//Cargamos la libreria de mongoose
var mongoose = require('mongoose');
//Creamos el esquema de Maquina
var Schema = mongoose.Schema;

//El esquema de Maquina tendra los siguientes atributos
var MachineSchema = Schema({

    numberMachine: [Number],
    square: { type: Schema.ObjectId, ref: 'Square' }
});

//Exportamos el modelo para usarlo en otros archivos
module.exports = mongoose.model('Machine', MachineSchema);