'use strict'

//Librerias
var express = require('express');

//Controladores
var WeekController = require('../controllers/week');

//Método Router
var api = express.Router();

//** TO DO Definir Métodos */
api.get('/consultar-semanas', WeekController.getWeek);

//Exportar
module.exports = api;