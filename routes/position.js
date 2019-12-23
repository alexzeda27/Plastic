'use strict'

//Cargamos la libreria de express
var express = require('express');
//Cargamos el controlador de puestos
var PositionController = require('../controllers/position');

//Usamos el método Router de express para definir las rutas
var api = express.Router();

//Definimos las rutas
api.get('/', PositionController.home);
api.post('/registrar', PositionController.savePosition);
api.get('/consultar/:id', PositionController.getPosition);
api.get('/consultar-paginados/:page?', PositionController.getPositions);
api.put('/actualizar/:id', PositionController.updatePosition);
api.delete('/eliminar/:id', PositionController.removePosition);

//Exportamos las api
module.exports = api