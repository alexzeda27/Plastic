'use strict'

//Cargamos la libreria de mongoose
var mongoose = require('mongoose');
//Creamos el esquema de customer
var Schema = mongoose.Schema;

//El esquema de producto tendra los siguientes atributos
var SchemaProduct = Schema({

    nameProduct: String,
    serialNumber: String,
    version: String,
    customer: { type: Schema.ObjectId, ref: 'Customer'}
});

//Exportamos el modelo
module.exports = mongoose.model('Product', SchemaProduct);