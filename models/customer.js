'use strict'

//Cargamos la libreria de mongoose
var mongoose = require('mongoose');
//Creamos el esquema de cliente
var Schema = mongoose.Schema;

//El esquema de Cliente tendra los siguientes atributos
var SchemaCustomer = Schema({

    customerName: String
});

//Exportamos el modelo
module.exports = mongoose.model('Customer', SchemaCustomer);

