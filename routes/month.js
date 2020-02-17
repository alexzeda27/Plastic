'use strict'

//Librerias
var express = require('express');

//Controladores
var MonthController = require('../controllers/month');

//Método Router
var api = express.Router();

//** TO DO Definir Métodos */
api.get('/consultar-meses', MonthController.getMonth);

//Exportar
module.exports = api;