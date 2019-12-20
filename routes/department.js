'use strict'

//Cargamos la libreria de express
var express = require('express');
//Cargamos el controlador de departamentos
var DepartmentController = require('../controllers/department');

//Usamos el método Router de express para definir las rutas
var api = express.Router();

//Definimos las rutas
api.get('/', DepartmentController.home);
api.post('/registrar', DepartmentController.saveDepartment);
api.get('/consultar/:id', DepartmentController.getDepartment);
api.put('/actualizar/:id', DepartmentController.updateDepartment);
api.delete('/eliminar/:id', DepartmentController.removeDepartment);

//Exportamos las api
module.exports = api;