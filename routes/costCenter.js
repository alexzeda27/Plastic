'use strict'

//Cargamos la libreria de express
var express = require('express');
//Cargamos el controlador de centro_costos
var CostCenterController = require('../controllers/costCenter');

//Usamos el método Router de express para definir las rutas
var api = express.Router();

//Definimos las rutas
api.get('/', CostCenterController.home);
api.post('/registrar', CostCenterController.saveCostCenter);
api.get('/consultar/:id', CostCenterController.getCostCenter);
api.put('/actualizar/:id', CostCenterController.updateCostCenter);
api.delete('/eliminar/:id', CostCenterController.removeCostCenter);

//Exportamos las api
module.exports = api;