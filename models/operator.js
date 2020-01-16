'use strict'

//Cargamos la libreria de mongoose
var mongoose = require('mongoose');
//Creamos un esquema para el modelo Operator
var Schema = mongoose.Schema;

//El esquema de Operator tendra los siguientes atributos
var OperatorSchema = Schema({

    employee: { type: Schema.ObjectId, ref: 'Employee' },
    square: { type : Schema.ObjectId, ref: 'Square' },
    machine: { type: Schema.ObjectId, ref: 'Machine' },
    turn: { type: Schema.ObjectId, ref: 'Turn' }
});

//Exportaremos el modelo para usarlo en otros archivos
module.exports = mongoose.model('Operator', OperatorSchema);