'use strict'

//Importamos el controlador de movilidad
var MobilityController = require('../controllers/mobility');
//Importamos la libreria de express
var express = require('express');

//Usamos el método de Router para definir las rutas
var api = express.Router();

//Rutas
api.get('/', MobilityController.home);
api.post('/crear-registro', MobilityController.createRegister);
api.get('/consultar-registros', MobilityController.getRegisters);
api.put('/actualizar-registro/:id', MobilityController.updateRegister);
api.delete('/eliminar-registro/:id', MobilityController.removeRegister);
api.post('/crear-movilidad', MobilityController.createMobility);
api.get('/consultar-movilidad', MobilityController.getMobility);
api.put('/actualizar-movilidad', MobilityController.updateMobility);

//Exportamos las api
module.exports = api;
