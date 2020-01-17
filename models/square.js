'use strict'

//Cargamos la libreria de mongoose
var mongoose = require('mongoose');
//Creamos el esquema de Square
var Schema = mongoose.Schema;

//El esquema de Square tendra los siguientes atributos
var SquareSchema = Schema({

    numberSquare: String,
    department: { type: Schema.ObjectId, ref: 'Department'}
});

//Exportamos el modelo para usarlo en otros archivos
module.exports = mongoose.model('Square', SquareSchema);