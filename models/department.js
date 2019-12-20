'use strict'

//Cargamos al libreria de mongoose
var mongoose = require('mongoose');
//Creamos un esquema para el modelo de Departamento
var Schema = mongoose.Schema;

//El esquema de Departamentos tendra los siguientes atributos
var DepartmentSchema = Schema({

    departmentName: String
});

//Exportaremos el modelo para usarlo en otros archivos
module.exports = mongoose.model('Department', DepartmentSchema);