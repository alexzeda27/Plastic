'use strict'

//Cargamos la libreria de express
var express = require('express');
//Cargamos el controlador de Tipo_trabajador
var TypeWorkerController = require('../controllers/typeWorker')

//Usamos el método Router de express para definir rutas
var api = express.Router();

//Métodos de salida para las rutas
api.get('/', TypeWorkerController.home);
api.post('/registrar', TypeWorkerController.saveTypeWorker);
api.get('/consultar/:id', TypeWorkerController.getTypeWorker);
api.put('/actualizar/:id', TypeWorkerController.updateTypeWorker);
api.delete('/eliminar/:id', TypeWorkerController.removeTypeWorker);

//Exportamos las api
module.exports = api;