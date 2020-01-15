'use strict'

//Cargamos la libreria de express
var express = require('express');
//Cargamos el controlador de puestos
var PositionController = require('../controllers/position');

//Usamos el método Router de express para definir las rutas
var api = express.Router();

//Definimos las rutas
api.get('/', PositionController.home);
api.post('/registrar-puesto', PositionController.savePosition);
api.get('/consultar-puesto/:id', PositionController.getPosition);
api.get('/consultar-puesto-paginados/:page?', PositionController.getPositions);
api.put('/actualizar-puesto/:id', PositionController.updatePosition);
api.delete('/eliminar-puesto/:id', PositionController.removePosition);

//Exportamos las api
module.exports = api