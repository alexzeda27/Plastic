'use strict'

//Cargamos la libreria de express
var express = require('express');
//Cargamos la libreria de multiparty
var multipart = require('connect-multiparty');

//Cargamos el controlador de empleados
var EmployeeController = require('../controllers/employee');

//Cargamos el middleware del token
var md_auth = require('../middlewares/authenticated');

//Cargamos el directorio de las imagenes
var md_upload = multipart({uploadDir: './uploads/employees'});

//Usamos el método de Router de express para definir las rutas
var api = express.Router();

//Definimos las rutas 
api.get('/', EmployeeController.home);
api.post('/registrar-empleado', EmployeeController.saveEmployee);
api.post('/login', EmployeeController.loginEmployee);
api.get('/consultar-empleado/:payroll', EmployeeController.getEmployee);
api.get('/consultar-empleado-paginados/:page?', EmployeeController.getEmployees);
api.get('/consultar-empleados', EmployeeController.getEmployeesOnly);
api.put('/actualizar-empleado/:payroll', EmployeeController.updateEmployee);
api.delete('/eliminar-empleado/:payroll', EmployeeController.removeEmployee);
api.post('/cargar-imagen/:payroll', md_upload, EmployeeController.uploadImageEmployee);
api.get('/consultar-imagen/:imageFile', EmployeeController.getImageFiles);
api.put('/eliminar-imagen/:payroll/:imageFile', EmployeeController.removeImageFiles);

//Exportamos las api
module.exports = api;