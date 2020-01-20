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
api.get('/consultar-bloques', SupervisorController.getSquaresOnly);
api.get('/consultar-bloque/:id', SupervisorController.getSquare);
api.get('/consultar-bloque-paginados/:page?', SupervisorController.getSquares);
api.put('/actualizar-bloque/:id', SupervisorController.updateSquares);
api.delete('/eliminar-bloque/:id', SupervisorController.removeSquare);
api.post('/crear-maquina', SupervisorController.saveMachine);
api.get('/consultar-maquina/:id', SupervisorController.getMachine);
api.get('/consultar-maquinas', SupervisorController.getMachinesOnly);
api.get('/consultar-maquina-paginados/:page?', SupervisorController.getMachines);
api.put('/actualizar-maquina/:id', SupervisorController.updateMachines);
api.delete('/eliminar-maquina/:id', SupervisorController.removeMachine);
api.post('/crear-cliente', SupervisorController.createCustomer);
api.get('/consultar-cliente/:id', SupervisorController.getCustomer);
api.get('/consultar-clientes', SupervisorController.getCustomersOnly);
api.get('/consultar-cliente-paginados/:page?', SupervisorController.getCustomers);
api.put('/actualizar-cliente/:id', SupervisorController.updateCustomer);
api.delete('/eliminar-cliente/:id', SupervisorController.removeCustomer);
api.post('/crear-producto', SupervisorController.createProducts);
api.get('/consultar-producto/:id', SupervisorController.getProduct);
api.get('/consultar-productos', SupervisorController.getProductsOnly);
api.get('/consultar-producto-paginados/:page?', SupervisorController.getProducts);
api.put('/actualizar-producto/:id', SupervisorController.updateProduct);
api.delete('/eliminar-producto/:id', SupervisorController.removeProduct);
api.put('/actualizar-operador/:id', SupervisorController.updateOperator);
api.get('/consultar-operadores', SupervisorController.getOperators);
api.delete('/eliminar-operador/:id', SupervisorController.removeOperator);

//Exportamos las rutas
module.exports = api;