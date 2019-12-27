'use strict'

//Cargamos el controlador de supervisor
var SupervisorController = require('../controllers/supervisor');

//Cargamos la libreria de express
var express = require('express');

//Creamos las rutas con el método Router de express
var api = express.Router();

//Definimos las rutas
api.get('/', SupervisorController.home);
api.get('/consultar/:id', SupervisorController.getSupervisor);
api.get('/consultar-paginados/:page?', SupervisorController.getSupervisors);
api.post('/crear-bloque', SupervisorController.saveSquare);
api.get('/consultar-bloque/:id', SupervisorController.getSquare);
api.get('/consultar-bloque-paginados/:page?', SupervisorController.getSquares);
api.put('/actualizar/:id', SupervisorController.updateSquares);

//Exportamos las rutas
module.exports = api;