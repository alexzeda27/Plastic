'use strict'

//Librerias
var express = require('express');

//Controladores
var MobilitydateController = require('../controllers/mobilityDate');

//Método Router
var api = express.Router();

//** TO DO Definir Métodos */
api.post('/crear-fechaMovilidad', MobilitydateController.createMobilityDate);
api.get('/consultar-fechaMovilidad/:id', MobilitydateController.getMobilityDate);
api.get('/consultar-fechasMovilidad', MobilitydateController.getMobilityDates);
api.put('/actualizar-fechaMovilidad/:id', MobilitydateController.updateMobilityDate);
api.delete('/eliminar-fechaMovilidad/:id', MobilitydateController.removeMobilityDate);

//Exportar
module.exports = api;