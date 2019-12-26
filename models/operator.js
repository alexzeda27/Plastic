'use strict'

//Cargamos la libreria de mongoose
var mongoose = require('mongoose');
//Creamos un esquema para el modelo Operator
var Schema = mongoose.Schema;

//El esquema de Operator tendra los siguientes atributos
var OperatorSchema = Schema({

    employee: { type: Schema.ObjectId, ref: 'Employee' },
});

//Exportaremos el modelo para usarlo en otros archivos
module.exports = mongoose.model('Operator', OperatorSchema);