'use strict'

//Cargamos la libreria de express
var express = require('express');
//Cargamos el controlador de departamentos
var DepartmentMobilityController = require('../controllers/departmentMobilityDate');

//Usamos el método Router de express para definir las rutas
var api = express.Router();

//Definimos las rutas
api.post('/crear-departamento-movilidad', DepartmentMobilityController.createDepartmentMobility);
api.get('/consultar-departamento-movilidad/:id', DepartmentMobilityController.getDepartmentMobility);
api.get('/consultar-departamentos-movilidad/', DepartmentMobilityController.getDepartmentsMobility);

//Exportamos las api
module.exports = api;