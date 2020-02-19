'use strict'

//Librerias
var express = require('express');

//Controladores
var MobilityController = require('../controllers/mobility');

//Método Router
var api = express.Router();

//** TO DO Definir Métodos */
api.post('/crear-movilidad', MobilityController.createMobility);
api.get('/consultar-movilidad/:id', MobilityController.getMobility);
api.get('/consultar-movilidades', MobilityController.getMobilities);
api.delete('/eliminar-movilidad/:id', MobilityController.removeMobility);
api.get('/consultar-coincidencia', MobilityController.getMobilityGraphic);

//Exportar
module.exports = api;