'use strict'

//Cargamos la libreria de express
var express = require('express');
//Cargamos la libreria de body-parser
var bodyParser = require('body-parser');

//A la variable app le asignamos los métodos de express
var app = express();

//Cargar rutas

//Cargamos la ruta de tipo de trabajadores
var typeWorker_routes = require('./routes/typeWorker');
//Cargamos la ruta de centro_costos
var costCenter_routes = require('./routes/costCenter');
//Cargamos la ruta de departamentos
var department_routes = require('./routes/department');

//Middlewares

//Parseamos los datos por la URI
app.use(bodyParser.urlencoded({ extended: false }));
//Los codificamos como Json
app.use(bodyParser.json());

//Cors

//Rutas
app.use('/api/tipo-trabajador', typeWorker_routes);
app.use('/api/centro-costo', costCenter_routes);
app.use('/api/departamento', department_routes);

//Exportar
module.exports = app;