'use strict'

//Librerias
var express = require('express');

//Controladores
var DayController = require('../controllers/day');

//Método Router
var api = express.Router();

//** TO DO Definir Métodos */
api.get('/consultar-dias', DayController.getDay);

//Exportar
module.exports = api;