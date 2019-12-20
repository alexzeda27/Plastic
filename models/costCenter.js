'use strict'

//Cargamos al libreria de mongoose
var mongoose = require('mongoose');
//Creamos un esquema para el modelo de CostCenter
var Schema = mongoose.Schema;

//El esquema de Tipo_trabajadores tendra los siguientes atributos
var CostCenterSchema = Schema({

    center: String
});

//Exportaremos el modelo para usarlo en otros archivos
module.exports = mongoose.model('CostCenter', CostCenterSchema);