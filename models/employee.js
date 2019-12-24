'use strict'

//Cargamos la libreria de mongoose
var mongoose = require('mongoose');
//Creamos un esquema para el modelo Employee
var Schema = mongoose.Schema;

//El esquema de Employee tendra los siguientes atributos
var EmployeeSchema = Schema({

    payroll: String,
    name: String,
    surnameP: String,
    surnameM: String,
    image: String,
    position: { type: Schema.ObjectId, ref: 'Position' },
    department: { type: Schema.ObjectId, red: 'Department' } 
});

//Exportaremos el modelo para usarlo en otros archivos
module.exports = mongoose.model('Employee', EmployeeSchema);