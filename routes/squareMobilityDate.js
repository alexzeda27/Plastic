'use strict'

//Cargamos la libreria de express
var express = require('express');
//Cargamos el controlador de departamentos
var SquareMobilityDate = require('../controllers/squareMobilityDate');

//Usamos el método Router de express para definir las rutas
var api = express.Router();

//Definimos las rutas
api.post('/crear-bloque-movilidad', SquareMobilityDate.createSquareMobility);
api.get('/consultar-bloque-movilidad/:id', SquareMobilityDate.getSquareMobility);
api.get('/consultar-bloques-movilidad/', SquareMobilityDate.getSquaresMobility);

//Exportamos las api
module.exports = api;