'use strict'

//Cargamos la libreria de express
var express = require('express');
//Cargamos el controlador de departamentos
var DepartmentController = require('../controllers/department');

//Usamos el método Router de express para definir las rutas
var api = express.Router();

//Definimos las rutas
api.get('/', DepartmentController.home);
api.post('/registrar-departamento', DepartmentController.saveDepartment);
api.get('/consultar-departamento/:id', DepartmentController.getDepartment);
api.get('/consultar-departamento-paginados/:page?', DepartmentController.getDepartments);
api.get('/consultar-departamentos', DepartmentController.getDepartmentsOnly);
api.put('/actualizar-departamento/:id', DepartmentController.updateDepartment);
api.delete('/eliminar-departamento/:id', DepartmentController.removeDepartment);

//Exportamos las api
module.exports = api;