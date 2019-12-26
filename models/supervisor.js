'use strict'

//Cargamos la libreria de mongoose
var mongoose = require('mongoose');
//Creamos un esquema para el modelo Supervisor
var Schema = mongoose.Schema;

//El esquema de Supervisor tendra los siguientes atributos
var SupervisorSchema = Schema({

    employee: { type: Schema.ObjectId, ref: 'Employee' }
});

//Exportaremos el modelo para usarlo en otros archivos
module.exports = mongoose.model('Supervisor', SupervisorSchema);