'use strict'

//Cargamos la libreria de express
var express = require('express');

//Cargamos el controlador de Operator
var OperatorController = require('../controllers/operator');

//Usamos el método Router para definir las rutas
var api = express.Router();

//Definimos los métodos
api.get('/', OperatorController.home);
api.get('/consultar/:id', OperatorController.getOperator);
api.get('/consultar-paginados/:page?', OperatorController.getOperators);

//Exportamos los métodos
module.exports = api;
