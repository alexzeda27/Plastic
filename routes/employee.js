'use strict'

//Cargamos la libreria de express
var express = require('express');
//Cargamos el controlador de empleados
var EmployeeController = require('../controllers/employee');

//Usamos el método de Router de express para definir las rutas
var api = express.Router();

//Definimos las rutas 
api.get('/', EmployeeController.home);
api.post('/registrar', EmployeeController.saveEmployee);

//Exportamos las api
module.exports = api;